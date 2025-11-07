import { IProjectRepository, CreateProjectDTO, UpdateProjectDTO } from '../../domain/repositories/IProjectRepository';
import { Project } from '../../domain/entities/Project';
import { prisma } from '../database/prisma';

export class PrismaProjectRepository implements IProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    const project = Project.create({
      name: data.name,
      description: data.description,
      color: data.color,
      userId: data.userId,
    });

    const createdProject = await prisma.project.create({
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });

    return Project.create({
      name: createdProject.name,
      description: createdProject.description || undefined,
      color: createdProject.color || undefined,
      userId: createdProject.userId,
    }, createdProject.id);
  }

  async findById(id: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    return Project.create({
      name: project.name,
      description: project.description || undefined,
      color: project.color || undefined,
      userId: project.userId,
    }, project.id);
  }

  async findByUserId(userId: string, search?: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: {
        userId,
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
        videos: {
          include: {
            _count: {
              select: {
                annotations: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(project => {
      const videoCount = project._count.videos;
      const annotationCount = project.videos.reduce((sum, video) => sum + video._count.annotations, 0);

      const projectInstance = Project.create({
        name: project.name,
        description: project.description || undefined,
        color: project.color || undefined,
        userId: project.userId,
      }, project.id);

      // Adicionar contagens como propriedades extras
      (projectInstance as any).videoCount = videoCount;
      (projectInstance as any).annotationCount = annotationCount;

      return projectInstance;
    });
  }

  async findAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(project =>
      Project.create({
        name: project.name,
        description: project.description || undefined,
        color: project.color || undefined,
        userId: project.userId,
      }, project.id)
    );
  }

  async update(id: string, data: UpdateProjectDTO): Promise<Project> {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        updatedAt: new Date(),
      },
    });

    return Project.create({
      name: updatedProject.name,
      description: updatedProject.description || undefined,
      color: updatedProject.color || undefined,
      userId: updatedProject.userId,
    }, updatedProject.id);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  }
}

