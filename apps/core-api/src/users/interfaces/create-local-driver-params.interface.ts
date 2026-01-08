import { DriverDocumentsDto } from '../dto/driver-documents.dto';
import { AuthProvider } from '@app/common';

export interface ICreateLocalDriverParams {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  authProvider: AuthProvider;
  rut: string;
  documents?: DriverDocumentsDto;
}
