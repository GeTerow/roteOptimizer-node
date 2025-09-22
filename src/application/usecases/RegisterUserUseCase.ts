import type { RegisterUserDTO } from '../../domain/schemas/authSchemas.js';
import type { IUserRepository } from '../repositories/IUserRepository.js';
import type { IHashService } from '../services/IHashService.js';

export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(data: RegisterUserDTO) {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('E-mail ja cadastrado.');
    }

    const hashedPassword = await this.hashService.hash(data.password);
    const user = await this.usersRepository.create({ ...data, password: hashedPassword });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}