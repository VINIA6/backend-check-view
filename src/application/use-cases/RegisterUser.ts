import { hash } from 'bcrypt';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'VIEWER';
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const { name, email, password, role } = request;

    // Verificar se o email já está em uso
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('Email já está em uso');
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    // Validar nome (mínimo 3 caracteres)
    if (name.length < 3) {
      throw new Error('Nome deve ter no mínimo 3 caracteres');
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'ADMIN',
    });

    return {
      user,
    };
  }
}

