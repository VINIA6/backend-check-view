import { Request, Response } from 'express';
import { makeGetUserProjects } from '../../application/factories/makeGetUserProjects';

export class GetUserProjectsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    const { search } = request.query;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const getUserProjects = makeGetUserProjects();
      const projectsByDate = await getUserProjects.execute({
        userId,
        search: search as string | undefined,
      });

      return response.status(200).json(projectsByDate);
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Unexpected error.' });
    }
  }
}

