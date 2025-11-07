import { Request, Response } from 'express';
import { makeCreateVideo } from '../../application/factories/makeCreateVideo';

export class CreateVideoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, url, filePath, duration, thumbnail, projectId } = request.body;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const createVideo = makeCreateVideo();
      const video = await createVideo.execute({
        name,
        url,
        filePath,
        duration,
        thumbnail,
        projectId,
        userId,
      });

      return response.status(201).json({
        id: video.id,
        name: video.name,
        url: video.url,
        filePath: video.filePath,
        duration: video.duration,
        thumbnail: video.thumbnail,
        projectId: video.projectId,
        uploadedAt: video.uploadedAt,
        updatedAt: video.updatedAt,
      });
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Unexpected error.' });
    }
  }
}

