import { Video } from '../entities/Video';

export interface CreateVideoDTO {
  name: string;
  url?: string;
  filePath?: string;
  duration?: number;
  thumbnail?: string;
  projectId: string;
}

export interface UpdateVideoDTO {
  name?: string;
  url?: string;
  filePath?: string;
  duration?: number;
  thumbnail?: string;
}

export interface IVideoRepository {
  create(data: CreateVideoDTO): Promise<Video>;
  findById(id: string): Promise<Video | null>;
  findByProjectId(projectId: string): Promise<Video[]>;
  findByUserId(userId: string): Promise<Video[]>; // NOVO: buscar todos os vídeos do usuário
  update(id: string, data: UpdateVideoDTO): Promise<Video>;
  delete(id: string): Promise<void>;
}
