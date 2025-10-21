import { prisma } from '../lib/prisma.js';
import type { Customer } from '../../generated/prisma/index.js';

export class PrismaCustomerRepository {
  async search(query: string) {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { fantasyName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 15,
    });

    return customers.map(customer => {
      return {
        id: customer.id,
        displayName: customer.name || customer.fantasyName || 'Cliente sem Nome',
        address: this.formatAddress(customer),

        city: customer.city || 'Cidade não cadastrada',
        zipCode: customer.zipCode || 'CEP não cadastrado'
      };
    });
  }

  private formatAddress(customer: Customer): string {
    if (customer.deliveryAddress && customer.deliveryAddress.trim().length > 10) {
      return customer.deliveryAddress.trim();
    }

    const parts = [
      customer.address,       // Endereco
      customer.neighborhood,  // Bairro
      customer.city,          // Municipio
      customer.state,         // Estado
      customer.zipCode        // CEP
    ];

    // Filtra partes nulas ou vazias e junta com vírgula
    const formatted = parts
      .map(p => p?.trim()) // Limpa espaços em branco
      .filter(p => p)      // Remove nulos ou vazios
      .join(', ');

    return formatted || 'Endereço não cadastrado';
  }
}