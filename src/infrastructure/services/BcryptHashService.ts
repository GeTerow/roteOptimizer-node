import { hash, compare } from 'bcryptjs';
import type { IHashService } from '../../application/services/IHashService.js';

export class BcryptHashService implements IHashService {
  constructor(private readonly saltRounds = 10) {}

  hash(plain: string): Promise<string> {
    return hash(plain, this.saltRounds);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}