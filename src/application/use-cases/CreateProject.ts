import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Project } from '../../domain/entities/Project';

interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  userId: string;
}

export class CreateProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Project name is required');
    }

    if (input.name.length > 100) {
      throw new Error('Project name must be less than 100 characters');
    }

    const project = await this.projectRepository.create({
      name: input.name.trim(),
      description: input.description?.trim(),
      color: input.color,
      userId: input.userId,
    });

    return project;
  }
}

