import { Router } from 'express';
import { CreateShareLinkController } from '../controllers/CreateShareLinkController';
import { ValidateShareLinkController } from '../controllers/ValidateShareLinkController';
import { CreateGuestSessionController } from '../controllers/CreateGuestSessionController';
import { CreateGuestAnnotationController } from '../controllers/CreateGuestAnnotationController';
import { GetGuestAnnotationsController } from '../controllers/GetGuestAnnotationsController';
import { authMiddleware } from '../middlewares/auth';
import { guestAuthMiddleware } from '../middlewares/guestAuth';

const shareRoutes = Router();

const createShareLinkController = new CreateShareLinkController();
const validateShareLinkController = new ValidateShareLinkController();
const createGuestSessionController = new CreateGuestSessionController();
const createGuestAnnotationController = new CreateGuestAnnotationController();
const getGuestAnnotationsController = new GetGuestAnnotationsController();

// Protected route - create share link (requires authentication)
shareRoutes.post('/', authMiddleware, (req, res) => createShareLinkController.handle(req, res));

// Public routes - no authentication required
shareRoutes.get('/validate/:token', (req, res) => validateShareLinkController.handle(req, res));
shareRoutes.post('/guest-session', (req, res) => createGuestSessionController.handle(req, res));

// Guest routes - require guest token
shareRoutes.post('/annotations', guestAuthMiddleware, (req, res) => createGuestAnnotationController.handle(req, res));
shareRoutes.get('/annotations/video/:videoId', guestAuthMiddleware, (req, res) => getGuestAnnotationsController.handle(req, res));

export { shareRoutes };

