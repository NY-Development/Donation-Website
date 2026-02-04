const { prisma } = require('../config/database');
const { AppError } = require('../utils/appError');

const createCampaign = async (data) => {
  const campaign = await prisma.campaign.create({
    data: {
      title: data.title,
      description: data.description,
      goalAmount: data.goalAmount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      imageUrl: data.imageUrl,
      featured: data.featured || false,
    },
  });

  return campaign;
};

const getAllCampaigns = async (page = 1, limit = 10, status) => {
  const skip = (page - 1) * limit;
  const now = new Date();
  
  let where = {};
  if (status === 'active') {
    where = {
      startDate: { lte: now },
      endDate: { gte: now },
    };
  } else if (status === 'ended') {
    where = {
      endDate: { lt: now },
    };
  } else if (status === 'upcoming') {
    where = {
      startDate: { gt: now },
    };
  }

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.campaign.count({ where }),
  ]);

  return {
    campaigns,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getFeaturedCampaigns = async () => {
  const now = new Date();
  
  const campaigns = await prisma.campaign.findMany({
    where: {
      featured: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return campaigns;
};

const getCampaignById = async (id) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      donations: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      _count: {
        select: { donations: true },
      },
    },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Hide user info for anonymous donations
  const sanitizedDonations = campaign.donations.map((donation) => ({
    ...donation,
    user: donation.anonymous ? null : donation.user,
  }));

  return {
    ...campaign,
    donations: sanitizedDonations,
  };
};

const updateCampaign = async (id, data) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  const updatedCampaign = await prisma.campaign.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      goalAmount: data.goalAmount,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      imageUrl: data.imageUrl,
      featured: data.featured,
    },
  });

  return updatedCampaign;
};

const deleteCampaign = async (id) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  await prisma.campaign.delete({
    where: { id },
  });

  return true;
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getFeaturedCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
