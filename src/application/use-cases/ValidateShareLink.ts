import { ISharedLinkRepository } from '../../domain/repositories/ISharedLinkRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { IVideoRepository } from '../../domain/repositories/IVideoRepository';

interface ValidateShareLinkRequest {
  token: string;
}

interface ValidateShareLinkResponse {
  isValid: boolean;
  project?: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    videos: Array<{
      id: string;
      name: string;
      url?: string;
      duration: number;
      thumbnail?: string;
      annotationCount: number;
    }>;
  };
}

export class ValidateShareLink {
  constructor(
    private sharedLinkRepository: ISharedLinkRepository,
    private projectRepository: IProjectRepository,
    private videoRepository: IVideoRepository
  ) {}

  async execute(request: ValidateShareLinkRequest): Promise<ValidateShareLinkResponse> {
    const { token } = request;

    console.log('📋 ValidateShareLink - Searching for token:', token);

    // Find share link by token
    const shareLink = await this.sharedLinkRepository.findByToken(token);

    if (!shareLink) {
      console.log('❌ Share link not found in database');
      return { isValid: false };
    }

    console.log('✅ Share link found:', {
      id: shareLink.id,
      projectId: shareLink.projectId,
      expiresAt: shareLink.expiresAt,
      isActive: shareLink.isActive,
    });

    // Check if link is valid (active and not expired)
    if (!shareLink.isValid()) {
      console.log('❌ Share link is not valid (inactive or expired)');
      return { isValid: false };
    }

    console.log('✅ Share link is valid');

    // Get project details
    const project = await this.projectRepository.findById(shareLink.projectId);
    if (!project) {
      console.log('❌ Project not found:', shareLink.projectId);
      return { isValid: false };
    }

    console.log('✅ Project found:', project.name);

    // Get project videos
    const videos = await this.videoRepository.findByProjectId(shareLink.projectId);

    // Transform videos for response
    const videosWithCount = videos.map(video => ({
      id: video.id,
      name: video.name,
      url: video.url,
      duration: video.duration,
      thumbnail: video.thumbnail,
      annotationCount: 0, // Guest users don't need annotation count initially
    }));

    return {
      isValid: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        videos: videosWithCount,
      },
    };
  }
}

