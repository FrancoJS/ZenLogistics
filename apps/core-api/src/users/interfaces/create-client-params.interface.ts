import { AuthProvider } from '../enums/auth-provider.enum';

export interface ICreateClientParams {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  authProvider: AuthProvider;
}
