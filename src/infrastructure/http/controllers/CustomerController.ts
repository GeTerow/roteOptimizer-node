import type { Request, Response } from 'express';
import type { SearchCustomersUseCase } from '../../../application/usecases/SearchCustomersUseCase';

export class CustomerController {
  constructor(private searchCustomersUseCase: SearchCustomersUseCase) {}

  async handleSearch(req: Request, res: Response): Promise<Response> {
    const { name } = req.query;

    if (typeof name !== 'string') {
      return res.status(400).json({ message: 'A query "name" é obrigatória.' });
    }

    try {
      const result = await this.searchCustomersUseCase.execute(name);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor.';
      return res.status(500).json({ message: errorMessage });
    }
  }
}