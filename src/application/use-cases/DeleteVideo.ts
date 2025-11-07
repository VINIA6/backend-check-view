import { IVideoRepository } from '../../domain/repositories/IVideoRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

interface DeleteVideoInput {
  videoId: string;
  userId: string; // Para validar se o usuário é dono do projeto
}

export class DeleteVideo {
  constructor(
    private videoRepository: IVideoRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(input: DeleteVideoInput): Promise<void> {
    // Buscar o vídeo
    const video = await this.videoRepository.findById(input.videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    // Validar se o projeto pertence ao usuário
    const project = await this.projectRepository.findById(video.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== input.userId) {
      throw new Error('You do not have permission to delete this video');
    }

    // Deletar o vídeo
    await this.videoRepository.delete(input.videoId);
  }
}

