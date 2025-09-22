import type { RegisterUserDTO } from '../../domain/schemas/authSchemas.js';

export type UserRecord = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(data: RegisterUserDTO & { password: string }): Promise<UserRecord>;
}
