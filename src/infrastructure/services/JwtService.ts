import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';
import type { IJwtService } from '../../application/services/IJwtService.js';

export class JwtService implements IJwtService {
  private readonly secret: string;

  constructor(secret = process.env.JWT_SECRET) {
    if (!secret) {
      throw new Error('Vari?vel de ambiente JWT_SECRET n?o configurada.');
    }

    this.secret = secret;
  }

  generate(payload: JwtPayload, expiresIn?: SignOptions['expiresIn']): string {
    const resolvedExpiresIn = expiresIn ?? ('1h' as SignOptions['expiresIn']);
    return sign(payload, this.secret, { expiresIn: resolvedExpiresIn } as SignOptions);
  }

  verify<T = JwtPayload>(token: string): T {
    return verify(token, this.secret) as T;
  }
}
