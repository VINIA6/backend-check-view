import { PrismaSharedLinkRepository } from '../../infrastructure/repositories/PrismaSharedLinkRepository';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';
import { CreateShareLink } from '../use-cases/CreateShareLink';

export function makeCreateShareLink() {
  const sharedLinkRepository = new PrismaSharedLinkRepository();
  const projectRepository = new PrismaProjectRepository();
  return new CreateShareLink(sharedLinkRepository, projectRepository);
}

