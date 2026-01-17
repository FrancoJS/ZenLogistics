import { UserRole } from '../enums/user-role.enum';

export interface IActiveUser {
  id: string;
  email: string;
  role: UserRole;
  driverId: string | null;
  tokenVersion: number;
  companyId?: string;
}
