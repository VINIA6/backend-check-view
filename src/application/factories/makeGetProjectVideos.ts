import { GetProjectVideos } from '../use-cases/GetProjectVideos';
import { PrismaVideoRepository } from '../../infrastructure/repositories/PrismaVideoRepository';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';

export function makeGetProjectVideos() {
  const videoRepository = new PrismaVideoRepository();
  const projectRepository = new PrismaProjectRepository();
  const getProjectVideos = new GetProjectVideos(videoRepository, projectRepository);
  return getProjectVideos;
}

