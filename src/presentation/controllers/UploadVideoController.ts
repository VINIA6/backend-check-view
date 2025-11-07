import { Request, Response } from 'express';
import { makeCreateVideo } from '../../application/factories/makeCreateVideo';

export class UploadVideoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    const { name, projectId, duration } = request.body;
    const file = request.file;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    if (!file) {
      return response.status(400).json({ message: 'No file uploaded' });
    }

    if (!projectId) {
      return response.status(400).json({ message: 'Project ID is required' });
    }

    try {
      const createVideo = makeCreateVideo();
      
      // URL para acessar o vídeo via API
      const videoUrl = `/api/videos/stream/${file.filename}`;
      
      const video = await createVideo.execute({
        name: name || file.originalname,
        url: videoUrl,
        filePath: file.filename, // Salvar apenas o nome do arquivo
        duration: duration ? parseInt(duration) : 0,
        projectId,
        userId,
      });

      return response.status(201).json({
        id: video.id,
        name: video.name,
        url: video.url,
        filePath: video.filePath,
        duration: video.duration,
        projectId: video.projectId,
        uploadedAt: video.uploadedAt,
        updatedAt: video.updatedAt,
      });
    } catch (error: any) {
      return response.status(400).json({ 
        message: error.message || 'Unexpected error while uploading video.' 
      });
    }
  }
}

