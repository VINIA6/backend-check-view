import { Request, Response } from 'express';
import { makeCreateGuestSession } from '../../application/factories/makeCreateGuestSession';

export class CreateGuestSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { token, name, email } = req.body;

      if (!token || !name || !email) {
        return res.status(400).json({ error: 'Token, name, and email are required' });
      }

      const createGuestSession = makeCreateGuestSession();
      const result = await createGuestSession.execute({
        token,
        name,
        email,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error creating guest session:', error);
      
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

