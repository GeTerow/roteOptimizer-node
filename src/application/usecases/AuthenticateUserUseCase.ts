import type { LoginDTO } from '../../domain/schemas/authSchemas.js';
import type { IUserRepository } from '../repositories/IUserRepository.js';
import type { IJwtService } from '../services/IJwtService.js';
import type { IHashService } from '../services/IHashService.js';

export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly hashService: IHashService,
  ) {}

  async execute(data: LoginDTO) {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Credenciais invalidas.');
    }

    const passwordMatches = await this.hashService.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new Error('Credenciais invalidas.');
    }

    const token = this.jwtService.generate({ sub: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}