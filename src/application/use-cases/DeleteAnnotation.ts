import { IAnnotationRepository } from '../../domain/repositories/IAnnotationRepository';

interface DeleteAnnotationRequest {
  annotationId: string;
  userId: string; // Para verificar ownership
}

export class DeleteAnnotation {
  constructor(private annotationRepository: IAnnotationRepository) {}

  async execute(request: DeleteAnnotationRequest): Promise<void> {
    const { annotationId, userId } = request;

    // Buscar anotação existente
    const existingAnnotation = await this.annotationRepository.findById(annotationId);

    if (!existingAnnotation) {
      throw new Error('Annotation not found');
    }

    // Verificar ownership
    if (existingAnnotation.userId !== userId) {
      throw new Error('You can only delete your own annotations');
    }

    await this.annotationRepository.delete(annotationId);
  }
}

