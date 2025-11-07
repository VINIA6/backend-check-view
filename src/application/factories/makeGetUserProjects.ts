import { GetUserProjects } from '../use-cases/GetUserProjects';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';

export function makeGetUserProjects() {
  const projectRepository = new PrismaProjectRepository();
  const getUserProjects = new GetUserProjects(projectRepository);
  return getUserProjects;
}

