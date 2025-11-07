import { Router } from 'express';
import { CreateVideoController } from '../controllers/CreateVideoController';
import { GetAllVideosController } from '../controllers/GetAllVideosController';
import { GetProjectVideosController } from '../controllers/GetProjectVideosController';
import { DeleteVideoController } from '../controllers/DeleteVideoController';
import { UploadVideoController } from '../controllers/UploadVideoController';
import { StreamVideoController } from '../controllers/StreamVideoController';
import { authMiddleware } from '../middlewares/auth';
import { uploadConfig } from '../../infrastructure/config/multer';

const videoRoutes = Router();

// Instanciar controllers
const createVideoController = new CreateVideoController();
const getAllVideosController = new GetAllVideosController();
const getProjectVideosController = new GetProjectVideosController();
const deleteVideoController = new DeleteVideoController();
const uploadVideoController = new UploadVideoController();
const streamVideoController = new StreamVideoController();

// Rota pública para streaming (não requer autenticação)
videoRoutes.get('/stream/:filename', (req, res) => streamVideoController.handle(req, res));

// Todas as outras rotas de vídeo requerem autenticação
videoRoutes.use(authMiddleware);

// Rotas
videoRoutes.post('/', (req, res) => createVideoController.handle(req, res));
videoRoutes.post('/upload', uploadConfig.single('video'), (req, res) => uploadVideoController.handle(req, res)); // NOVO: upload com multer
videoRoutes.get('/', (req, res) => getAllVideosController.handle(req, res));
videoRoutes.get('/project/:projectId', (req, res) => getProjectVideosController.handle(req, res));
videoRoutes.delete('/:videoId', (req, res) => deleteVideoController.handle(req, res));

export { videoRoutes };

