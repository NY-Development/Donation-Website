const express = require('express');
const donationController = require('../controllers/donation.controller');
const { authenticate } = require('../middleware/authenticate');
const { validateRequest } = require('../middleware/validateRequest');
const { createDonationSchema } = require('../validation/donation.validation');

const router = express.Router();

// Public routes
router.get('/', donationController.getAllDonations);
router.get('/stats', donationController.getDonationStats);
router.get('/:id', donationController.getDonationById);

// Protected routes
router.use(authenticate);

router.post('/', validateRequest(createDonationSchema), donationController.createDonation);
router.get('/user/history', donationController.getUserDonations);

module.exports = router;
