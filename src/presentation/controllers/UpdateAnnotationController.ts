import { Request, Response } from 'express';
import { makeUpdateAnnotation } from '../../application/factories/makeUpdateAnnotation';

export class UpdateAnnotationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    const { annotationId } = request.params;
    const { timestamp, comment, color } = request.body;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    if (!annotationId) {
      return response.status(400).json({
        message: 'Annotation ID is required',
      });
    }

    try {
      const updateAnnotation = makeUpdateAnnotation();

      const annotation = await updateAnnotation.execute({
        annotationId,
        userId,
        timestamp: timestamp !== undefined ? parseFloat(timestamp) : undefined,
        comment,
        color,
      });

      return response.status(200).json({
        id: annotation.id,
        videoId: annotation.videoId,
        userId: annotation.userId,
        timestamp: annotation.timestamp,
        comment: annotation.comment,
        color: annotation.color,
        createdAt: annotation.createdAt,
        updatedAt: annotation.updatedAt,
      });
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error while updating annotation.',
      });
    }
  }
}

