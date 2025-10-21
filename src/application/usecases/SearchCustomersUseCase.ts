import type { PrismaCustomerRepository } from '../../infrastructure/repositories/PrismaCustomerRepository.js';

export class SearchCustomersUseCase {
  constructor(private customerRepository: PrismaCustomerRepository) {}

  async execute(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const customers = await this.customerRepository.search(query);
    return customers;
  }
}