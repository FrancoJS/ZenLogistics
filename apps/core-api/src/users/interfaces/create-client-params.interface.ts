import { AuthProvider } from '../enums/user-role.enum';

export interface ICreateClientParams {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  authProvider: AuthProvider;
}
