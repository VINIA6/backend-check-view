import { PrismaSharedLinkRepository } from '../../infrastructure/repositories/PrismaSharedLinkRepository';
import { PrismaProjectRepository } from '../../infrastructure/repositories/PrismaProjectRepository';
import { PrismaVideoRepository } from '../../infrastructure/repositories/PrismaVideoRepository';
import { ValidateShareLink } from '../use-cases/ValidateShareLink';

export function makeValidateShareLink() {
  const sharedLinkRepository = new PrismaSharedLinkRepository();
  const projectRepository = new PrismaProjectRepository();
  const videoRepository = new PrismaVideoRepository();
  return new ValidateShareLink(sharedLinkRepository, projectRepository, videoRepository);
}

