import { Request, Response } from 'express';
import { makeDeleteVideo } from '../../application/factories/makeDeleteVideo';

export class DeleteVideoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { videoId } = request.params;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const deleteVideo = makeDeleteVideo();
      await deleteVideo.execute({
        videoId,
        userId,
      });

      return response.status(200).json({ message: 'Video deleted successfully' });
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Unexpected error.' });
    }
  }
}

