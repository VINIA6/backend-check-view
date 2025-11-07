import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: User;
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const { email, password } = request;

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Verificar senha
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos');
    }

    // Gerar token JWT
    const token = sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'default-secret',
      {
        expiresIn: '7d',
      }
    );

    return {
      user,
      token,
    };
  }
}

