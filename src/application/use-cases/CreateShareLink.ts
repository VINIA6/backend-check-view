import { ISharedLinkRepository } from '../../domain/repositories/ISharedLinkRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

interface CreateShareLinkRequest {
  projectId: string;
  userId: string;
  expiresInDays?: number; // Optional: link expires in X days
}

interface CreateShareLinkResponse {
  id: string;
  token: string;
  projectId: string;
  expiresAt?: Date;
  createdAt: Date;
}

export class CreateShareLink {
  constructor(
    private sharedLinkRepository: ISharedLinkRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(request: CreateShareLinkRequest): Promise<CreateShareLinkResponse> {
    const { projectId, userId, expiresInDays } = request;

    // Verify project exists and user owns it
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== userId) {
      throw new Error('Unauthorized: You do not own this project');
    }

    // Check if active link already exists
    const existingLinks = await this.sharedLinkRepository.findByProjectId(projectId);
    const activeLink = existingLinks.find(link => link.isValid());

    if (activeLink) {
      return {
        id: activeLink.id,
        token: activeLink.token,
        projectId: activeLink.projectId,
        expiresAt: activeLink.expiresAt,
        createdAt: activeLink.createdAt,
      };
    }

    // Calculate expiration date if specified
    let expiresAt: Date | undefined;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create new share link
    const sharedLink = await this.sharedLinkRepository.create({
      projectId,
      createdBy: userId,
      expiresAt,
    });

    return {
      id: sharedLink.id,
      token: sharedLink.token,
      projectId: sharedLink.projectId,
      expiresAt: sharedLink.expiresAt,
      createdAt: sharedLink.createdAt,
    };
  }
}

