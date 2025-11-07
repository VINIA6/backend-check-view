import { PrismaAnnotationRepository } from '../../infrastructure/repositories/PrismaAnnotationRepository';
import { DeleteAnnotation } from '../use-cases/DeleteAnnotation';

export function makeDeleteAnnotation() {
  const annotationRepository = new PrismaAnnotationRepository();
  const deleteAnnotation = new DeleteAnnotation(annotationRepository);
  return deleteAnnotation;
}

