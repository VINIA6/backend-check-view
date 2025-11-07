import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { AuthenticateUserUseCase } from '../use-cases/AuthenticateUser';

export function makeAuthenticateUser() {
  const userRepository = new PrismaUserRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

  return authenticateUserUseCase;
}

