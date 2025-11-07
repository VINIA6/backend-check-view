import { Request, Response } from 'express';
import { makeCreateProject } from '../../application/factories/makeCreateProject';

export class CreateProjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, color } = request.body;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const createProject = makeCreateProject();
      const project = await createProject.execute({
        name,
        description,
        color,
        userId,
      });

      return response.status(201).json({
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      });
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Unexpected error.' });
    }
  }
}

