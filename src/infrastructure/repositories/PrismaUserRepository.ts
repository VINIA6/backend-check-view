import { User } from '../../domain/entities/User';
import { CreateUserDTO, IUserRepository } from '../../domain/repositories/IUserRepository';
import { prisma } from '../database/prisma';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'ADMIN',
        avatar: data.avatar,
      },
    });

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users.map(
      (user) =>
        new User({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          avatar: user.avatar || undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
    );
  }

  async update(id: string, data: Partial<CreateUserDTO>): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

