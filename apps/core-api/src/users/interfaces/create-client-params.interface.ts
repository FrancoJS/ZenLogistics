import { AuthProvider } from '../../../../../libs/common/src/enums/auth-provider.enum';

export interface ICreateClientParams {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  authProvider: AuthProvider;
}
