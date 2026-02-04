const { prisma } = require('../config/database');
const { AppError } = require('../utils/appError');

const createDonation = async (data) => {
  // Verify campaign exists
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId },
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  const donation = await prisma.donation.create({
    data: {
      amount: data.amount,
      message: data.message,
      anonymous: data.anonymous || false,
      userId: data.userId,
      campaignId: data.campaignId,
    },
    include: {
      campaign: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // Update campaign's current amount
  await prisma.campaign.update({
    where: { id: data.campaignId },
    data: {
      currentAmount: {
        increment: data.amount,
      },
    },
  });

  return donation;
};

const getAllDonations = async (page = 1, limit = 10, campaignId) => {
  const skip = (page - 1) * limit;
  const where = campaignId ? { campaignId } : {};

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.count({ where }),
  ]);

  // Hide user info for anonymous donations
  const sanitizedDonations = donations.map((donation) => ({
    ...donation,
    user: donation.anonymous ? null : donation.user,
  }));

  return {
    donations: sanitizedDonations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDonationById = async (id) => {
  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      campaign: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  // Hide user info for anonymous donations
  if (donation.anonymous) {
    donation.user = null;
  }

  return donation;
};

const getUserDonations = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.count({ where: { userId } }),
  ]);

  return {
    donations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDonationStats = async () => {
  const [totalDonations, totalAmount, donationCount] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    }),
    prisma.donation.groupBy({
      by: ['campaignId'],
      _sum: {
        amount: true,
      },
      _count: true,
    }),
  ]);

  return {
    totalDonations,
    totalAmount: totalAmount._sum.amount || 0,
    campaignStats: donationCount,
  };
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  getUserDonations,
  getDonationStats,
};
