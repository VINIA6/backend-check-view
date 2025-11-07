import { IAnnotationRepository } from '../../domain/repositories/IAnnotationRepository';
import { Annotation } from '../../domain/entities/Annotation';

interface CreateAnnotationRequest {
  videoId: string;
  userId?: string; // Opcional agora (para convidados)
  guestName?: string;
  guestEmail?: string;
  timestamp: number;
  comment: string;
  color?: string;
}

export class CreateAnnotation {
  constructor(private annotationRepository: IAnnotationRepository) {}

  async execute(request: CreateAnnotationRequest): Promise<Annotation> {
    const { videoId, userId, guestName, guestEmail, timestamp, comment, color } = request;

    // Validações
    if (timestamp < 0) {
      throw new Error('Timestamp cannot be negative');
    }

    if (!comment.trim()) {
      throw new Error('Comment cannot be empty');
    }

    // Verificar se é usuário ou convidado
    if (!userId && (!guestName || !guestEmail)) {
      throw new Error('Either userId or guest information must be provided');
    }

    const annotation = await this.annotationRepository.create({
      videoId,
      userId,
      guestName,
      guestEmail,
      timestamp,
      comment: comment.trim(),
      color,
    });

    return annotation;
  }
}

