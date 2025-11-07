import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token não fornecido',
    });
  }

  // Bearer token
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({
      message: 'Token mal formatado',
    });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'default-secret') as TokenPayload;

    // Adicionar dados do usuário no request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role as 'admin' | 'viewer',
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
}

