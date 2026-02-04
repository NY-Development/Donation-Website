const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const donationRoutes = require('./donation.routes');
const campaignRoutes = require('./campaign.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/donations', donationRoutes);
router.use('/campaigns', campaignRoutes);

module.exports = router;
