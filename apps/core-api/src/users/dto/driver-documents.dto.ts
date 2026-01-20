import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DriverDocumentsDto {
  /**
   * URL de la foto frontal de la licencia
   * @example 'https://res.cloudinary.com/demo/image/upload/license-front.jpg'
   */
  @IsString()
  @IsNotEmpty()
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { message: 'Debe ser una URL válida y segura (HTTPS)' },
  )
  licenseFront: string;

  /**
   * URL de la foto trasera de la licencia
   * @example 'https://res.cloudinary.com/demo/image/upload/license-back.jpg'
   */
  @IsString()
  @IsNotEmpty()
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { message: 'Debe ser una URL válida y segura (HTTPS)' },
  )
  licenseBack: string;

  /**
   * URL de la foto del certificado de antecedentes
   * @example 'https://res.cloudinary.com/demo/image/upload/criminal-record.jpg'
   */
  @IsString()
  @IsNotEmpty()
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { message: 'Debe ser una URL válida y segura (HTTPS)' },
  )
  criminalRecord: string;
}
