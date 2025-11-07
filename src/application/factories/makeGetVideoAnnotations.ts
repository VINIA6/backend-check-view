import { PrismaAnnotationRepository } from '../../infrastructure/repositories/PrismaAnnotationRepository';
import { GetVideoAnnotations } from '../use-cases/GetVideoAnnotations';

export function makeGetVideoAnnotations() {
  const annotationRepository = new PrismaAnnotationRepository();
  const getVideoAnnotations = new GetVideoAnnotations(annotationRepository);
  return getVideoAnnotations;
}

