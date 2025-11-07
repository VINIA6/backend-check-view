import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface GuestPayload {
  name: string;
  email: string;
  shareToken: string;
  projectId: string;
}

export const guestAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Guest') {
    return next();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as GuestPayload;
    
    // Adicionar informações do guest ao request
    req.guest = decoded;
    
    next();
  } catch (error) {
    console.error('Invalid guest token:', error);
    next();
  }
};
