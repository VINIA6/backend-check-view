import { Request, Response } from 'express';
import { makeCreateAnnotation } from '../../application/factories/makeCreateAnnotation';

export class CreateAnnotationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    const guestName = request.guest?.name;
    const guestEmail = request.guest?.email;
    const { videoId, timestamp, comment, color } = request.body;

    // Verificar se é usuário ou convidado
    if (!userId && !guestName) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    if (!videoId || timestamp === undefined || !comment) {
      return response.status(400).json({
        message: 'Missing required fields: videoId, timestamp, comment',
      });
    }

    try {
      const createAnnotation = makeCreateAnnotation();

      const annotation = await createAnnotation.execute({
        videoId,
        userId,
        guestName,
        guestEmail,
        timestamp: parseFloat(timestamp),
        comment,
        color,
      });

      return response.status(201).json({
        id: annotation.id,
        videoId: annotation.videoId,
        userId: annotation.userId,
        guestName: annotation.guestName,
        guestEmail: annotation.guestEmail,
        timestamp: annotation.timestamp,
        comment: annotation.comment,
        color: annotation.color,
        createdAt: annotation.createdAt,
        updatedAt: annotation.updatedAt,
        // Adicionar informação do autor
        author: annotation.isGuestAnnotation() 
          ? { name: annotation.guestName, email: annotation.guestEmail, isGuest: true }
          : { id: annotation.userId, isGuest: false }
      });
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error while creating annotation.',
      });
    }
  }
}