import { AuthProvider } from '@app/common';

export interface ICreateLocalClientParams {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  authProvider: AuthProvider;
}
