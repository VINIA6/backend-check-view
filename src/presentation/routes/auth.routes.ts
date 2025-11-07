import { Router } from 'express';
import { RegisterUserController } from '../controllers/RegisterUserController';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';

const authRoutes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();

// POST /auth/register - Registro de usuário
authRoutes.post('/register', (req, res) => registerUserController.handle(req, res));

// POST /auth/login - Login de usuário
authRoutes.post('/login', (req, res) => authenticateUserController.handle(req, res));

export { authRoutes };

