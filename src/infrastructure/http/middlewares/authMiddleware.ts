import type { NextFunction, Request, Response } from 'express';
import type { IJwtService } from '../../../application/services/IJwtService.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email?: string;
    };
  }
}

export const createAuthMiddleware = (jwtService: IJwtService) =>
  (req: Request, res: Response, next: NextFunction): void | Response => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Autoriza??o obrigat?ria.' });
    }

    const token = authHeader.substring(7);

    try {
      const payload = jwtService.verify<{ sub: string; email?: string }>(token);
      const user = { id: String(payload.sub) } as { id: string; email?: string };

      if (payload.email) {
        user.email = payload.email;
      }

      req.user = user;
      next();
    } catch {
      return res.status(401).json({ message: 'Token inv?lido ou expirado.' });
    }
  };
