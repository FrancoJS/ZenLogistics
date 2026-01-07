import { IJwtPayload } from './jwt-payload';

export interface IRefreshTokenPayload extends IJwtPayload {
  refreshToken: string;
}
