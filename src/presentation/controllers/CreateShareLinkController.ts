import { Request, Response } from 'express';
import { makeCreateShareLink } from '../../application/factories/makeCreateShareLink';

export class CreateShareLinkController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { projectId, expiresInDays } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      const createShareLink = makeCreateShareLink();
      const result = await createShareLink.execute({
        projectId,
        userId,
        expiresInDays,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error creating share link:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

