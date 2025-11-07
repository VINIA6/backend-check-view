import { Request, Response } from 'express';
import { z } from 'zod';
import { makeAuthenticateUser } from '../../application/factories/makeAuthenticateUser';

export class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validação com Zod
      const authenticateBodySchema = z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'Senha é obrigatória'),
      });

      const { email, password } = authenticateBodySchema.parse(req.body);

      // Executar use case
      const authenticateUser = makeAuthenticateUser();
      const { user, token } = await authenticateUser.execute({
        email,
        password,
      });

      // Retornar dados públicos + token
      return res.status(200).json({
        user: user.toPublic(),
        token,
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
        return res.status(401).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    }
  }
}

