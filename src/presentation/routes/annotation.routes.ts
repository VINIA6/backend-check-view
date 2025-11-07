import { Router } from 'express';
import { CreateAnnotationController } from '../controllers/CreateAnnotationController';
import { GetVideoAnnotationsController } from '../controllers/GetVideoAnnotationsController';
import { UpdateAnnotationController } from '../controllers/UpdateAnnotationController';
import { DeleteAnnotationController } from '../controllers/DeleteAnnotationController';
import { authMiddleware } from '../middlewares/auth';
import { authOrGuestMiddleware } from '../middlewares/authOrGuest';

const annotationRoutes = Router();

// Instanciar controllers
const createAnnotationController = new CreateAnnotationController();
const getVideoAnnotationsController = new GetVideoAnnotationsController();
const updateAnnotationController = new UpdateAnnotationController();
const deleteAnnotationController = new DeleteAnnotationController();

// Rotas
// POST - Criar anotação (usuário ou convidado)
annotationRoutes.post('/', authOrGuestMiddleware, (req, res) => createAnnotationController.handle(req, res));

// GET - Visualizar anotações (usuário ou convidado)
annotationRoutes.get('/video/:videoId', authOrGuestMiddleware, (req, res) => getVideoAnnotationsController.handle(req, res));

// PUT/DELETE - Apenas usuários autenticados podem editar/deletar
annotationRoutes.put('/:annotationId', authMiddleware, (req, res) => updateAnnotationController.handle(req, res));
annotationRoutes.delete('/:annotationId', authMiddleware, (req, res) => deleteAnnotationController.handle(req, res));

export { annotationRoutes };

