const donationService = require('../services/donation.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

const createDonation = asyncHandler(async (req, res, next) => {
  const donation = await donationService.createDonation({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(ApiResponse.success(donation, 'Donation created successfully'));
});

const getAllDonations = asyncHandler(async (req, res, next) => {
  const { page, limit, campaignId } = req.query;
  const donations = await donationService.getAllDonations(
    Number(page) || 1,
    Number(limit) || 10,
    campaignId
  );
  res.status(200).json(ApiResponse.success(donations, 'Donations retrieved successfully'));
});

const getDonationById = asyncHandler(async (req, res, next) => {
  const donation = await donationService.getDonationById(req.params.id);
  res.status(200).json(ApiResponse.success(donation, 'Donation retrieved successfully'));
});

const getUserDonations = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const donations = await donationService.getUserDonations(
    req.user.id,
    Number(page) || 1,
    Number(limit) || 10
  );
  res.status(200).json(ApiResponse.success(donations, 'User donations retrieved successfully'));
});

const getDonationStats = asyncHandler(async (req, res, next) => {
  const stats = await donationService.getDonationStats();
  res.status(200).json(ApiResponse.success(stats, 'Donation stats retrieved successfully'));
});

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  getUserDonations,
  getDonationStats,
};
