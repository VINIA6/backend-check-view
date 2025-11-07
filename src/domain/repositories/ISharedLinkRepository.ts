import { SharedLink } from '../entities/SharedLink';

export interface CreateSharedLinkDTO {
  projectId: string;
  createdBy: string;
  expiresAt?: Date;
}

export interface ISharedLinkRepository {
  create(data: CreateSharedLinkDTO): Promise<SharedLink>;
  findByToken(token: string): Promise<SharedLink | null>;
  findByProjectId(projectId: string): Promise<SharedLink[]>;
  deactivate(id: string): Promise<void>;
  deleteByProjectId(projectId: string): Promise<void>;
}

