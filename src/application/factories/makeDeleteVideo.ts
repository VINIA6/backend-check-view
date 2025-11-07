import { DeleteVideo } from '../use-cases/DeleteVideo';
import { PrismaVideoRepository } from '../../infrastructure/repositories/PrismaVideoRepository';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';

export function makeDeleteVideo() {
  const videoRepository = new PrismaVideoRepository();
  const projectRepository = new PrismaProjectRepository();
  const deleteVideo = new DeleteVideo(videoRepository, projectRepository);
  return deleteVideo;
}

