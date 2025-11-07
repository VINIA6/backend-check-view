import { IVideoRepository } from '../../domain/repositories/IVideoRepository';
import { Video } from '../../domain/entities/Video';

interface GetAllVideosInput {
  userId: string;
}

export class GetAllVideos {
  constructor(private videoRepository: IVideoRepository) {}

  async execute(input: GetAllVideosInput): Promise<Video[]> {
    if (!input.userId) {
      throw new Error('User ID is required');
    }

    const videos = await this.videoRepository.findByUserId(input.userId);
    return videos;
  }
}

