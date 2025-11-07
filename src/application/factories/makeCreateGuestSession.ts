import { PrismaSharedLinkRepository } from '../../infrastructure/repositories/PrismaSharedLinkRepository';
import { CreateGuestSession } from '../use-cases/CreateGuestSession';

export function makeCreateGuestSession() {
  const sharedLinkRepository = new PrismaSharedLinkRepository();
  return new CreateGuestSession(sharedLinkRepository);
}

