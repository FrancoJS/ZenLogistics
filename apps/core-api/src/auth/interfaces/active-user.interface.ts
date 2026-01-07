export interface IActiveUser {
  id: string;
  email: string;
  role: string;
  driverId: string | null;
  tokenVersion: number;
}
