import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class DriverDocumentsDto {
  @ApiProperty({
    description: 'URL de la foto frontal de la licencia',
    example: 'https://res.cloudinary.com/demo/image/upload/license-front.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @Matches(/https:\/\/.+/, { message: 'Debe ser una URL segura (HTTPS)' })
  licenseFront: string;

  @ApiProperty({
    description: 'URL de la foto trasera de la licencia',
    example: 'https://res.cloudinary.com/demo/image/upload/license-back.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @Matches(/https:\/\/.+/, { message: 'Debe ser una URL segura (HTTPS)' })
  licenseBack: string;

  @ApiProperty({
    description: 'URL de la foto del certificado de antecedentes',
    example: 'https://res.cloudinary.com/demo/image/upload/criminal-record.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @Matches(/https:\/\/.+/, { message: 'Debe ser una URL segura (HTTPS)' })
  criminalRecord: string;
}
