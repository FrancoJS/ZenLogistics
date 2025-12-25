import { DriverDocumentsDto } from '../dto/driver-documents.dto';
import { AuthProvider } from '../enums/user-role.enum';

export interface ICreateDriverParams {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  authProvider: AuthProvider;
  rut: string;
  documents?: DriverDocumentsDto;
}
