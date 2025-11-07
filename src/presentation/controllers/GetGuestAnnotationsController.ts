import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';

export class GetGuestAnnotationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { videoId } = req.params;
      const guest = req.guest;

      if (!guest) {
        return res.status(401).json({ error: 'Unauthorized' });
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

      // Get all annotations for this video (not user-specific)
      const annotations = await prisma.annotation.findMany({
        where: { videoId },
        orderBy: { timestamp: 'asc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json(annotations);
    } catch (error: any) {
      console.error('Error getting guest annotations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

