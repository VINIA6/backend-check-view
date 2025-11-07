import { CreateVideo } from '../use-cases/CreateVideo';
import { PrismaVideoRepository } from '../../infrastructure/repositories/PrismaVideoRepository';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';

export function makeCreateVideo() {
  const videoRepository = new PrismaVideoRepository();
  const projectRepository = new PrismaProjectRepository();
  const createVideo = new CreateVideo(videoRepository, projectRepository);
  return createVideo;
}

