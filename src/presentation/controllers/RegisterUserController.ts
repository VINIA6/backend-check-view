import { Request, Response } from 'express';
import { z } from 'zod';
import { makeRegisterUser } from '../../application/factories/makeRegisterUser';

export class RegisterUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validação com Zod
      const registerBodySchema = z.object({
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        role: z.enum(['ADMIN', 'VIEWER']).optional(),
      });

      const { name, email, password, role } = registerBodySchema.parse(req.body);

      // Executar use case
      const registerUser = makeRegisterUser();
      const { user } = await registerUser.execute({
        name,
        email,
        password,
        role,
      });

      // Retornar dados públicos (sem senha)
      return res.status(201).json({
        user: user.toPublic(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Erro de validação',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }
}

