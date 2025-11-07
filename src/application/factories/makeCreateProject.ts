import { CreateProject } from '../use-cases/CreateProject';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';

export function makeCreateProject() {
  const projectRepository = new PrismaProjectRepository();
  const createProject = new CreateProject(projectRepository);
  return createProject;
}

