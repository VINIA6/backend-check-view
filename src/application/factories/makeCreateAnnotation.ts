import { PrismaAnnotationRepository } from '../../infrastructure/repositories/PrismaAnnotationRepository';
import { CreateAnnotation } from '../use-cases/CreateAnnotation';

export function makeCreateAnnotation() {
  const annotationRepository = new PrismaAnnotationRepository();
  const createAnnotation = new CreateAnnotation(annotationRepository);
  return createAnnotation;
}

