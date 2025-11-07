import { Project } from '../entities/Project';

export interface CreateProjectDTO {
  name: string;
  description?: string;
  color?: string;
  userId: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  color?: string;
}

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string, search?: string): Promise<Project[]>;
  findAll(): Promise<Project[]>;
  update(id: string, data: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<void>;
}

