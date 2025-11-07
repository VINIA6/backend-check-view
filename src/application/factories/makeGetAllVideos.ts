import { GetAllVideos } from '../use-cases/GetAllVideos';
import { PrismaVideoRepository } from '../../infrastructure/repositories/PrismaVideoRepository';

export function makeGetAllVideos() {
  const videoRepository = new PrismaVideoRepository();
  const getAllVideos = new GetAllVideos(videoRepository);
  return getAllVideos;
}

