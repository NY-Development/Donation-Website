const campaignService = require('../services/campaign.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

const createCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await campaignService.createCampaign(req.body);
  res.status(201).json(ApiResponse.success(campaign, 'Campaign created successfully'));
});

const getAllCampaigns = asyncHandler(async (req, res, next) => {
  const { page, limit, status } = req.query;
  const campaigns = await campaignService.getAllCampaigns(
    Number(page) || 1,
    Number(limit) || 10,
    status
  );
  res.status(200).json(ApiResponse.success(campaigns, 'Campaigns retrieved successfully'));
});

const getFeaturedCampaigns = asyncHandler(async (req, res, next) => {
  const campaigns = await campaignService.getFeaturedCampaigns();
  res.status(200).json(ApiResponse.success(campaigns, 'Featured campaigns retrieved successfully'));
});

const getCampaignById = asyncHandler(async (req, res, next) => {
  const campaign = await campaignService.getCampaignById(req.params.id);
  res.status(200).json(ApiResponse.success(campaign, 'Campaign retrieved successfully'));
});

const updateCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await campaignService.updateCampaign(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(campaign, 'Campaign updated successfully'));
});

const deleteCampaign = asyncHandler(async (req, res, next) => {
  await campaignService.deleteCampaign(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Campaign deleted successfully'));
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getFeaturedCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
