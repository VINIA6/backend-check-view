import { IVideoRepository } from '../../domain/repositories/IVideoRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Video } from '../../domain/entities/Video';

interface GetProjectVideosInput {
  projectId: string;
  userId: string; // Para validar se o usuário tem acesso ao projeto
}

export class GetProjectVideos {
  constructor(
    private videoRepository: IVideoRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(input: GetProjectVideosInput): Promise<Video[]> {
    // Validar se o projeto existe e pertence ao usuário
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== input.userId) {
      throw new Error('You do not have permission to view videos from this project');
    }

    const videos = await this.videoRepository.findByProjectId(input.projectId);
    return videos;
  }
}

