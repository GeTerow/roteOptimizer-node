import type { IUserRepository, UserRecord } from '../../application/repositories/IUserRepository.js';
import type { RegisterUserDTO } from '../../domain/schemas/authSchemas.js';
import { prisma } from '../lib/prisma.js';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: RegisterUserDTO & { password: string }): Promise<UserRecord> {
    return prisma.user.create({ data });
  }
}
