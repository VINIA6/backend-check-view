import { IAnnotationRepository } from '../../domain/repositories/IAnnotationRepository';
import { Annotation } from '../../domain/entities/Annotation';

interface UpdateAnnotationRequest {
  annotationId: string;
  userId: string; // Para verificar ownership
  timestamp?: number;
  comment?: string;
  color?: string;
}

export class UpdateAnnotation {
  constructor(private annotationRepository: IAnnotationRepository) {}

  async execute(request: UpdateAnnotationRequest): Promise<Annotation> {
    const { annotationId, userId, timestamp, comment, color } = request;

    // Buscar anotação existente
    const existingAnnotation = await this.annotationRepository.findById(annotationId);

    if (!existingAnnotation) {
      throw new Error('Annotation not found');
    }

    // Verificar ownership
    if (existingAnnotation.userId !== userId) {
      throw new Error('You can only update your own annotations');
    }

    // Validações
    if (timestamp !== undefined && timestamp < 0) {
      throw new Error('Timestamp cannot be negative');
    }

    if (comment !== undefined && !comment.trim()) {
      throw new Error('Comment cannot be empty');
    }

    const updatedAnnotation = await this.annotationRepository.update(annotationId, {
      timestamp,
      comment: comment?.trim(),
      color,
    });

    return updatedAnnotation;
  }
}

