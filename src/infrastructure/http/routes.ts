// src/infrastructure/http/routes.ts
import { Router } from 'express';
import multer from 'multer';
import { ScanController } from './controllers/ScanController.js';
import { OptimizeController } from './controllers/OptimizeController.js';
import { PythonOptimizerService } from '../services/PythonOptimizerService.js';
import { OpenAIScanService } from '../services/OpenAiScanService.js';
import { OptimizeRouteUseCase } from '../../application/usecases/OptimizeRouteUseCase.js';
import { ScanImageUseCase } from '../../application/usecases/ScanImageUseCase.js';
import { RegisterUserUseCase } from '../../application/usecases/RegisterUserUseCase.js';
import { AuthenticateUserUseCase } from '../../application/usecases/AuthenticateUserUseCase.js';
import { AuthController } from './controllers/AuthController.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { JwtService } from '../services/JwtService.js';
import { BcryptHashService } from '../services/BcryptHashService.js';
import { createAuthMiddleware } from './middlewares/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const userRepository = new UserRepository();
const jwtService = new JwtService();
const hashService = new BcryptHashService();
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService);
const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, jwtService, hashService);
const authController = new AuthController(registerUserUseCase, authenticateUserUseCase);
const authMiddleware = createAuthMiddleware(jwtService);

const pythonOptimizerService = new PythonOptimizerService();
const optimizeRouteUseCase = new OptimizeRouteUseCase(pythonOptimizerService);
const optimizeController = new OptimizeController(optimizeRouteUseCase);
const openAIScanService = new OpenAIScanService();
const scanImageUseCase = new ScanImageUseCase(openAIScanService);
const scanController = new ScanController(scanImageUseCase);

router.post('/api/auth/register', (req, res) => authController.register(req, res));
router.post('/api/auth/login', (req, res) => authController.login(req, res));

router.use(authMiddleware);

router.post('/api/scan', upload.single('image'), (req, res) => scanController.handle(req, res));
router.post('/api/optimize', (req, res) => optimizeController.handle(req, res));

export { router };