import { ISharedLinkRepository, CreateSharedLinkDTO } from '../../domain/repositories/ISharedLinkRepository';
import { SharedLink } from '../../domain/entities/SharedLink';
import { prisma } from '../database/prisma';

export class PrismaSharedLinkRepository implements ISharedLinkRepository {
  async create(data: CreateSharedLinkDTO): Promise<SharedLink> {
    const sharedLink = SharedLink.create({
      projectId: data.projectId,
      createdBy: data.createdBy,
      isActive: true,
      expiresAt: data.expiresAt,
    });

    await prisma.shareToken.create({
      data: {
        id: sharedLink.id,
        token: sharedLink.token,
        projectId: sharedLink.projectId,
        createdBy: sharedLink.createdBy,
        isActive: sharedLink.isActive,
        expiresAt: sharedLink.expiresAt,
        createdAt: sharedLink.createdAt,
        updatedAt: sharedLink.updatedAt,
      },
    });

    return sharedLink;
  }

  async findByToken(token: string): Promise<SharedLink | null> {
    const shareToken = await prisma.shareToken.findUnique({
      where: { token },
    });

    if (!shareToken) {
      return null;
    }

    return SharedLink.create({
      projectId: shareToken.projectId,
      createdBy: shareToken.createdBy,
      isActive: shareToken.isActive,
      expiresAt: shareToken.expiresAt || undefined,
    }, shareToken.id, shareToken.token); // Passar o token também
  }

  async findByProjectId(projectId: string): Promise<SharedLink[]> {
    const shareTokens = await prisma.shareToken.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return shareTokens.map(token =>
      SharedLink.create({
        projectId: token.projectId,
        createdBy: token.createdBy,
        isActive: token.isActive,
        expiresAt: token.expiresAt || undefined,
      }, token.id, token.token) // Passar o token também
    );
  }

  async deactivate(id: string): Promise<void> {
    await prisma.shareToken.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    await prisma.shareToken.deleteMany({
      where: { projectId },
    });
  }
}

