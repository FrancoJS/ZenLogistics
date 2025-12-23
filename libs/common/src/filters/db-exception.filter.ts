import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface PostgresError {
  code: string;
  detail?: string;
}

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DbExceptionFilter');

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const driverError = exception.driverError as unknown as PostgresError;

    const errorCode = driverError.code;

    this.logger.error(`DB ERROR: ${errorCode} - ${driverError.detail}`);

    switch (errorCode) {
      case '23505':
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'El registro ya existe en el sistema.',
          error: 'Conflict',
        });

      // 2. FOREIGN KEY VIOLATION (No existe el padre)
      // Muy útil cuando intentas guardar relaciones y el ID enviado no existe
      case '23503':
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Error de referencia: Estás intentando asociar datos a un registro que no existe.',
          error: 'Bad Request',
        });

      // 3. INVALID DATA TYPE (Ej: UUID inválido)
      // Pasa si alguien envía "abc" en un endpoint que busca por ID uuid
      case '22P02':
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Formato de datos inválido.',
          error: 'Bad Request',
        });

      // 4. NOT NULL VIOLATION (Faltan datos)
      // Usualmente los DTOs atrapan esto antes, pero por si acaso.
      case '23502':
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Falta un campo obligatorio.',
          error: 'Bad Request',
        });

      default:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor.',
        });
    }
  }
}
