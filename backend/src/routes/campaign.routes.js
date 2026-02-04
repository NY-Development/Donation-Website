const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const { createCampaignSchema, updateCampaignSchema } = require('../validation/campaign.validation');

const router = express.Router();

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/featured', campaignController.getFeaturedCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Protected routes
router.use(authenticate);

router.post('/', authorize('ADMIN'), validateRequest(createCampaignSchema), campaignController.createCampaign);
router.put('/:id', authorize('ADMIN'), validateRequest(updateCampaignSchema), campaignController.updateCampaign);
router.delete('/:id', authorize('ADMIN'), campaignController.deleteCampaign);

module.exports = router;
