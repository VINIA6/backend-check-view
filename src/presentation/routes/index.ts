import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { videoRoutes } from './video.routes';
import { annotationRoutes } from './annotation.routes';
import { shareRoutes } from './share.routes';

const routes = Router();

// Rotas de autenticação
routes.use('/auth', authRoutes);

// Rotas de projetos
routes.use('/projects', projectRoutes);

// Rotas de vídeos
routes.use('/videos', videoRoutes);

// Rotas de anotações
routes.use('/annotations', annotationRoutes);

// Rotas de compartilhamento
routes.use('/share', shareRoutes);

// Health check
routes.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'OK',
    message: 'API Video Annotation - Clean Architecture',
    timestamp: new Date().toISOString(),
  });
});

export { routes };

