import { PrismaAnnotationRepository } from '../../infrastructure/repositories/PrismaAnnotationRepository';
import { UpdateAnnotation } from '../use-cases/UpdateAnnotation';

export function makeUpdateAnnotation() {
  const annotationRepository = new PrismaAnnotationRepository();
  const updateAnnotation = new UpdateAnnotation(annotationRepository);
  return updateAnnotation;
}

