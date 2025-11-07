import { prisma } from '../../infrastructure/database/prisma';
import { ISharedLinkRepository } from '../../domain/repositories/ISharedLinkRepository';
import jwt from 'jsonwebtoken';

interface CreateGuestSessionRequest {
  token: string;
  name: string;
  email: string;
}

interface CreateGuestSessionResponse {
  guestToken: string;
  sessionId: string;
  expiresAt: Date;
}

export class CreateGuestSession {
  constructor(private sharedLinkRepository: ISharedLinkRepository) {}

  async execute(request: CreateGuestSessionRequest): Promise<CreateGuestSessionResponse> {
    const { token, name, email } = request;

    // Validate inputs
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email is required');
    }

    // Validate share link
    const shareLink = await this.sharedLinkRepository.findByToken(token);
    if (!shareLink || !shareLink.isValid()) {
      throw new Error('Invalid or expired share link');
    }

    // Create guest session
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Session expires in 24 hours

    const guestSession = await prisma.guestSession.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        token,
        expiresAt,
      },
    });

    // Generate JWT token for guest
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const guestToken = jwt.sign(
      {
        sessionId: guestSession.id,
        name: guestSession.name,
        email: guestSession.email,
        shareToken: token,
        projectId: shareLink.projectId,
        type: 'guest',
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      guestToken,
      sessionId: guestSession.id,
      expiresAt: guestSession.expiresAt,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

