import { IVideoRepository, CreateVideoDTO, UpdateVideoDTO } from '../../domain/repositories/IVideoRepository';
import { Video } from '../../domain/entities/Video';
import { prisma } from '../database/prisma';

export class PrismaVideoRepository implements IVideoRepository {
  async create(data: CreateVideoDTO): Promise<Video> {
    const video = Video.create({
      name: data.name,
      url: data.url,
      filePath: data.filePath,
      duration: data.duration || 0,
      thumbnail: data.thumbnail,
      projectId: data.projectId,
    });

    const createdVideo = await prisma.video.create({
      data: {
        id: video.id,
        name: video.name,
        url: video.url,
        filePath: video.filePath,
        duration: video.duration,
        thumbnail: video.thumbnail,
        projectId: video.projectId,
        uploadedAt: video.uploadedAt,
        updatedAt: video.updatedAt,
      },
    });

    return Video.create({
      name: createdVideo.name,
      url: createdVideo.url || undefined,
      filePath: createdVideo.filePath || undefined,
      duration: createdVideo.duration,
      thumbnail: createdVideo.thumbnail || undefined,
      projectId: createdVideo.projectId,
    }, createdVideo.id);
  }

  async findById(id: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return null;
    }

    return Video.create({
      name: video.name,
      url: video.url || undefined,
      filePath: video.filePath || undefined,
      duration: video.duration,
      thumbnail: video.thumbnail || undefined,
      projectId: video.projectId,
    }, video.id);
  }

  async findByProjectId(projectId: string): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            annotations: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return videos.map(video => {
      const videoInstance = Video.create({
        name: video.name,
        url: video.url || undefined,
        filePath: video.filePath || undefined,
        duration: video.duration,
        thumbnail: video.thumbnail || undefined,
        projectId: video.projectId,
      }, video.id);

      // Adicionar contagem de anotações
      (videoInstance as any).annotationCount = video._count.annotations;

      return videoInstance;
    });
  }

  async update(id: string, data: UpdateVideoDTO): Promise<Video> {
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        name: data.name,
        url: data.url,
        filePath: data.filePath,
        duration: data.duration,
        thumbnail: data.thumbnail,
        updatedAt: new Date(),
      },
    });

    return Video.create({
      name: updatedVideo.name,
      url: updatedVideo.url || undefined,
      filePath: updatedVideo.filePath || undefined,
      duration: updatedVideo.duration,
      thumbnail: updatedVideo.thumbnail || undefined,
      projectId: updatedVideo.projectId,
    }, updatedVideo.id);
  }

  async findByUserId(userId: string): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        project: {
          userId: userId,
        },
      },
      include: {
        _count: {
          select: {
            annotations: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return videos.map(video => {
      const videoInstance = Video.create({
        name: video.name,
        url: video.url || undefined,
        filePath: video.filePath || undefined,
        duration: video.duration,
        thumbnail: video.thumbnail || undefined,
        projectId: video.projectId,
      }, video.id);

      // Adicionar contagem de anotações e informações do projeto
      (videoInstance as any).annotationCount = video._count.annotations;
      (videoInstance as any).project = video.project;

      return videoInstance;
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.video.delete({
      where: { id },
    });
  }
}

