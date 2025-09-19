// src/infrastructure/http/routes.ts
import { Router } from 'express';
import multer from 'multer';
import { ScanController } from './controllers/ScanController.js';
import { OptimizeController } from './controllers/OptimizeController.js';
import { PythonOptimizerService } from '../services/PythonOptimizerService.js';
import { OpenAIScanService } from '../services/OpenAiScanService.js';
import { OptimizeRouteUseCase } from '../../application/usecases/OptimizeRouteUseCase.js';
import { ScanImageUseCase } from '../../application/usecases/ScanImageUseCase.js';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  });

const pythonOptimizerService = new PythonOptimizerService();
const optimizeRouteUseCase = new OptimizeRouteUseCase(pythonOptimizerService);
const optimizeController = new OptimizeController(optimizeRouteUseCase);
const openAIScanService = new OpenAIScanService();
const scanImageUseCase = new ScanImageUseCase(openAIScanService);
const scanController = new ScanController(scanImageUseCase);

router.post('/api/scan', upload.single('image'), (req, res) => scanController.handle(req, res));
router.post('/api/optimize', (req, res) => optimizeController.handle(req, res));

export { router };