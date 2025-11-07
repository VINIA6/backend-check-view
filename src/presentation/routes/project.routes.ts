import { Router } from 'express';
import { CreateProjectController } from '../controllers/CreateProjectController';
import { GetUserProjectsController } from '../controllers/GetUserProjectsController';
import { authMiddleware } from '../middlewares/auth';

const projectRoutes = Router();

// Instanciar controllers
const createProjectController = new CreateProjectController();
const getUserProjectsController = new GetUserProjectsController();

// Todas as rotas de projeto requerem autenticação
projectRoutes.use(authMiddleware);

// Rotas
projectRoutes.post('/', (req, res) => createProjectController.handle(req, res));
projectRoutes.get('/', (req, res) => getUserProjectsController.handle(req, res));

export { projectRoutes };

