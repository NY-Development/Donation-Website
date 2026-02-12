import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.middleware';
import { organizerController } from './organizer.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();

router.get('/status', requireAuth, organizerController.status);

router.post(
  '/verify',
  requireAuth,
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'livePhoto', maxCount: 1 }
  ]),
  organizerController.verify
);

export default router;
