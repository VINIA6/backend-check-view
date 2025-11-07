import { IAnnotationRepository, CreateAnnotationDTO, UpdateAnnotationDTO } from '../../domain/repositories/IAnnotationRepository';
import { Annotation } from '../../domain/entities/Annotation';
import { prisma } from '../database/prisma';

export class PrismaAnnotationRepository implements IAnnotationRepository {
  async create(data: CreateAnnotationDTO): Promise<Annotation> {
    const annotation = Annotation.create({
      videoId: data.videoId,
      userId: data.userId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      timestamp: data.timestamp,
      comment: data.comment,
      color: data.color,
    });

    const createdAnnotation = await prisma.annotation.create({
      data: {
        id: annotation.id,
        videoId: annotation.videoId,
        userId: annotation.userId,
        guestName: annotation.guestName,
        guestEmail: annotation.guestEmail,
        timestamp: annotation.timestamp,
        comment: annotation.comment,
        color: annotation.color,
        createdAt: annotation.createdAt,
        updatedAt: annotation.updatedAt,
      },
    });

    return Annotation.create({
      videoId: createdAnnotation.videoId,
      userId: createdAnnotation.userId || undefined,
      guestName: createdAnnotation.guestName || undefined,
      guestEmail: createdAnnotation.guestEmail || undefined,
      timestamp: createdAnnotation.timestamp,
      comment: createdAnnotation.comment,
      color: createdAnnotation.color || undefined,
    }, createdAnnotation.id);
  }

  async findById(id: string): Promise<Annotation | null> {
    const annotation = await prisma.annotation.findUnique({
      where: { id },
    });

    if (!annotation) {
      return null;
    }

    return Annotation.create({
      videoId: annotation.videoId,
      userId: annotation.userId || undefined,
      guestName: annotation.guestName || undefined,
      guestEmail: annotation.guestEmail || undefined,
      timestamp: annotation.timestamp,
      comment: annotation.comment,
      color: annotation.color || undefined,
    }, annotation.id);
  }

  async findByVideoId(videoId: string): Promise<Annotation[]> {
    const annotations = await prisma.annotation.findMany({
      where: { videoId },
      orderBy: { timestamp: 'asc' },
    });

    return annotations.map(annotation =>
      Annotation.create({
        videoId: annotation.videoId,
        userId: annotation.userId || undefined,
        guestName: annotation.guestName || undefined,
        guestEmail: annotation.guestEmail || undefined,
        timestamp: annotation.timestamp,
        comment: annotation.comment,
        color: annotation.color || undefined,
      }, annotation.id)
    );
  }

  async findByUserId(userId: string): Promise<Annotation[]> {
    const annotations = await prisma.annotation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return annotations.map(annotation =>
      Annotation.create({
        videoId: annotation.videoId,
        userId: annotation.userId || undefined,
        guestName: annotation.guestName || undefined,
        guestEmail: annotation.guestEmail || undefined,
        timestamp: annotation.timestamp,
        comment: annotation.comment,
        color: annotation.color || undefined,
      }, annotation.id)
    );
  }

  async update(id: string, data: UpdateAnnotationDTO): Promise<Annotation> {
    const updatedAnnotation = await prisma.annotation.update({
      where: { id },
      data: {
        timestamp: data.timestamp,
        comment: data.comment,
        color: data.color,
        updatedAt: new Date(),
      },
    });

    return Annotation.create({
      videoId: updatedAnnotation.videoId,
      userId: updatedAnnotation.userId || undefined,
      guestName: updatedAnnotation.guestName || undefined,
      guestEmail: updatedAnnotation.guestEmail || undefined,
      timestamp: updatedAnnotation.timestamp,
      comment: updatedAnnotation.comment,
      color: updatedAnnotation.color || undefined,
    }, updatedAnnotation.id);
  }

  async delete(id: string): Promise<void> {
    await prisma.annotation.delete({
      where: { id },
    });
  }

  async deleteByVideoId(videoId: string): Promise<void> {
    await prisma.annotation.deleteMany({
      where: { videoId },
    });
  }
}
