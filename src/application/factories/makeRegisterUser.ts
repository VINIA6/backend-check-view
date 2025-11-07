import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { RegisterUserUseCase } from '../use-cases/RegisterUser';

export function makeRegisterUser() {
  const userRepository = new PrismaUserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);

  return registerUserUseCase;
}

