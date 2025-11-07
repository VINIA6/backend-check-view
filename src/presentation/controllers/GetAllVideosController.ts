import { Request, Response } from 'express';
import { makeGetAllVideos } from '../../application/factories/makeGetAllVideos';

export class GetAllVideosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const getAllVideos = makeGetAllVideos();
      const videos = await getAllVideos.execute({ userId });

      return response.status(200).json(
        videos.map(video => ({
          id: video.id,
          name: video.name,
          url: video.url,
          filePath: video.filePath,
          duration: video.duration,
          thumbnail: video.thumbnail,
          projectId: video.projectId,
          project: (video as any).project, // Informações do projeto
          annotationCount: (video as any).annotationCount || 0,
          uploadedAt: video.uploadedAt,
          updatedAt: video.updatedAt,
        }))
      );
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Unexpected error.' });
    }
  }
}

