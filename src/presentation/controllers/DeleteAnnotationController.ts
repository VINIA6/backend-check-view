import { Request, Response } from 'express';
import { makeDeleteAnnotation } from '../../application/factories/makeDeleteAnnotation';

export class DeleteAnnotationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    const { annotationId } = request.params;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    if (!annotationId) {
      return response.status(400).json({
        message: 'Annotation ID is required',
      });
    }

    try {
      const deleteAnnotation = makeDeleteAnnotation();

      await deleteAnnotation.execute({
        annotationId,
        userId,
      });

      return response.status(204).send();
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || 'Unexpected error while deleting annotation.',
      });
    }
  }
}

