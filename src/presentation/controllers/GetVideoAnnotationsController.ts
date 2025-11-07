import { Request, Response } from 'express';
import { makeGetVideoAnnotations } from '../../application/factories/makeGetVideoAnnotations';

export class GetVideoAnnotationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { videoId } = request.params;

    if (!videoId) {
      return response.status(400).json({
        message: 'Video ID is required',
      });
    }

    try {
      const getVideoAnnotations = makeGetVideoAnnotations();

      const annotations = await getVideoAnnotations.execute({ videoId });

      return response.status(200).json(
        annotations.map(annotation => ({
          id: annotation.id,
          videoId: annotation.videoId,
          userId: annotation.userId,
          timestamp: annotation.timestamp,
          comment: annotation.comment,
          color: annotation.color,
          createdAt: annotation.createdAt,
          updatedAt: annotation.updatedAt,
        }))
      );
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error while fetching annotations.',
      });
    }
  }
}

