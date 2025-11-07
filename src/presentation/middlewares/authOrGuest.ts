import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}

interface GuestPayload {
  name: string;
  email: string;
  shareToken: string;
  projectId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      guest?: GuestPayload;
    }
  }
}

export const authOrGuestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const [type, token] = authHeader.split(' ');
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  try {
    if (type === 'Bearer') {
      // Autenticação normal de usuário
      const decoded = jwt.verify(token, jwtSecret) as any;
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role as 'admin' | 'viewer',
      };
      return next();
    } else if (type === 'Guest') {
      // Autenticação de convidado
      const decoded = jwt.verify(token, jwtSecret) as GuestPayload;
      req.guest = decoded;
      return next();
    } else {
      return res.status(401).json({ message: 'Invalid authorization type' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
