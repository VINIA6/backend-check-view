import { IAnnotationRepository } from '../../domain/repositories/IAnnotationRepository';
import { Annotation } from '../../domain/entities/Annotation';

interface GetVideoAnnotationsRequest {
  videoId: string;
}

export class GetVideoAnnotations {
  constructor(private annotationRepository: IAnnotationRepository) {}

  async execute(request: GetVideoAnnotationsRequest): Promise<Annotation[]> {
    const { videoId } = request;

    const annotations = await this.annotationRepository.findByVideoId(videoId);

    return annotations;
  }
}

