import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

interface GetUserProjectsInput {
  userId: string;
  search?: string;
}

interface ProjectsByDate {
  date: string;
  count: number;
  projects: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    userId: string;
    videoCount: number;
    annotationCount: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class GetUserProjects {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: GetUserProjectsInput): Promise<ProjectsByDate[]> {
    if (!input.userId) {
      throw new Error('User ID is required');
    }

    const projects = await this.projectRepository.findByUserId(input.userId, input.search);

    // Agrupar por data
    const projectsByDate = projects.reduce((acc, project) => {
      const dateKey = project.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push({
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        userId: project.userId,
        videoCount: (project as any).videoCount || 0,
        annotationCount: (project as any).annotationCount || 0,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });

      return acc;
    }, {} as Record<string, any[]>);

    // Converter para array e adicionar contagem
    const result: ProjectsByDate[] = Object.entries(projectsByDate).map(([date, projects]) => ({
      date,
      count: projects.length,
      projects,
    }));

    // Ordenar por data (mais recente primeiro)
    result.sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }
}

