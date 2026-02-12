import { Router } from 'express';
import { campaignController } from './campaign.controller';
import { validate } from '../../utils/validate';
import { campaignIdSchema, campaignQuerySchema, createCampaignSchema, mediaSchema, updateCampaignSchema } from './campaign.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireOrganizerVerification } from '../../middlewares/organizerVerification.middleware';

const router = Router();

router.get('/featured', campaignController.getFeatured);
router.get('/', validate(campaignQuerySchema, 'query'), campaignController.list);
router.get('/:id', validate(campaignIdSchema, 'params'), campaignController.getById);
router.get('/:id/donors', validate(campaignIdSchema, 'params'), campaignController.getDonors);

router.post('/', requireAuth, requireOrganizerVerification, validate(createCampaignSchema, 'body'), campaignController.create);
router.patch('/:id', requireAuth, validate(campaignIdSchema, 'params'), validate(updateCampaignSchema, 'body'), campaignController.update);
router.post('/:id/media', requireAuth, validate(campaignIdSchema, 'params'), validate(mediaSchema, 'body'), campaignController.uploadMedia);
router.post('/:id/submit', requireAuth, validate(campaignIdSchema, 'params'), campaignController.submit);

export default router;
