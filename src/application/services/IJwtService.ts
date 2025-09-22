import type { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface IJwtService {
  generate(payload: JwtPayload, expiresIn?: SignOptions['expiresIn']): string;
  verify<T>(token: string): T;
}
