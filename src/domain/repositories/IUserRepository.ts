import { User } from '../entities/User';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'VIEWER';
  avatar?: string;
}

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<CreateUserDTO>): Promise<User>;
  delete(id: string): Promise<void>;
}

