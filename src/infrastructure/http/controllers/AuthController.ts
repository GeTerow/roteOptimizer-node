import type { Request, Response } from 'express';
import { RegisterUserSchema, LoginSchema } from '../../../domain/schemas/authSchemas.js';
import type { RegisterUserUseCase } from '../../../application/usecases/RegisterUserUseCase.js';
import type { AuthenticateUserUseCase } from '../../../application/usecases/AuthenticateUserUseCase.js';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    const validation = RegisterUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Requisicao invalida.',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    try {
      const user = await this.registerUserUseCase.execute(validation.data);
      return res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao registrar usuario.';

      if (message === 'E-mail ja cadastrado.') {
        return res.status(409).json({ message });
      }

      return res.status(500).json({ message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const validation = LoginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Requisicao invalida.',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    try {
      const result = await this.authenticateUserUseCase.execute(validation.data);
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar usuario.';

      if (message === 'Credenciais invalidas.') {
        return res.status(401).json({ message });
      }

      return res.status(500).json({ message });
    }
  }
}