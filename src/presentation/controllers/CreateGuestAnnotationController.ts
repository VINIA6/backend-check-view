import { Request, Response } from 'express';
import { makeCreateAnnotation } from '../../application/factories/makeCreateAnnotation';
import { prisma } from '../../infrastructure/database/prisma';

export class CreateGuestAnnotationController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { videoId, timestamp, comment, color } = req.body;
      const guest = req.guest;

      if (!guest) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!videoId || timestamp === undefined || !comment) {
        return res.status(400).json({ 
          error: 'Video ID, timestamp, and comment are required' 
        });
      }

      // Verify video belongs to the shared project
      const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: { projectId: true },
      });

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      if (video.projectId !== guest.projectId) {
        return res.status(403).json({ 
          error: 'You do not have access to this video' 
        });
      }

      // Check if guest user exists, if not create it
      let guestUser = await prisma.user.findUnique({
        where: { email: guest.email },
      });

      if (!guestUser) {
        // Create a guest user
        guestUser = await prisma.user.create({
          data: {
            name: guest.name,
            email: guest.email,
            password: '', // No password for guest users
            role: 'VIEWER',
          },
        });
      }

      const createAnnotation = makeCreateAnnotation();
      const result = await createAnnotation.execute({
        videoId,
        userId: guestUser.id,
        timestamp,
        comment,
        color,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating guest annotation:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

