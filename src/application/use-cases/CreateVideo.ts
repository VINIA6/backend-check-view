import { IVideoRepository } from '../../domain/repositories/IVideoRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Video } from '../../domain/entities/Video';

interface CreateVideoInput {
  name: string;
  url?: string;
  filePath?: string;
  duration?: number;
  thumbnail?: string;
  projectId: string;
  userId: string; // Para validar se o usuário é dono do projeto
}

export class CreateVideo {
  constructor(
    private videoRepository: IVideoRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(input: CreateVideoInput): Promise<Video> {
    // Validar se o nome foi fornecido
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Video name is required');
    }

    // Validar se o projeto existe e pertence ao usuário
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== input.userId) {
      throw new Error('You do not have permission to add videos to this project');
    }

    // Validar se pelo menos uma fonte foi fornecida (url ou filePath)
    if (!input.url && !input.filePath) {
      throw new Error('Either url or filePath must be provided');
    }

    const video = await this.videoRepository.create({
      name: input.name.trim(),
      url: input.url,
      filePath: input.filePath,
      duration: input.duration || 0,
      thumbnail: input.thumbnail,
      projectId: input.projectId,
    });

    return video;
  }
}

