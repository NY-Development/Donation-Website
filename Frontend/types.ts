
export type UserRole = 'donor' | 'organizer' | 'admin';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface UserProfile {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified?: boolean;
  totalDonated: number;
  isOrganizerVerified?: boolean;
  createdAt: string;
}

export interface OrganizerVerificationStatus {
  isOrganizerVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Campaign {
  _id: string;
  title: string;
  category: string;
  story: string;
  fundingStyle?: 'keep' | 'all_or_nothing';
  goalAmount: number;
  raisedAmount: number;
  cbeAccountNumber: string;
  status: 'draft' | 'pending_verification' | 'approved' | 'rejected' | 'paused';
  media: string[];
  isSuccessStory?: boolean;
  goalReachedAt?: string;
  organizer: string;
  createdBy?: string;
  createdAt: string;
  location?: string;
  urgent?: boolean;
}

export interface Donation {
  _id: string;
  user?: string;
  campaign: string;
  amount: number;
  paymentProvider: string;
  status: 'pending' | 'succeeded' | 'failed';
  transactionId?: string;
  createdAt: string;
}

export interface CampaignDonor {
  amount: number;
  user?: string;
  createdAt: string;
}

export interface GlobalStats {
  totalDonated: number;
  donorsCount: number;
  livesImpacted: number;
}

export interface DonationTrendPoint {
  date: string;
  total: number;
  count: number;
}

export interface AdminTopCampaign {
  id: string;
  title: string;
  raisedAmount: number;
  goalAmount: number;
  category?: string;
  createdAt?: string;
}

export interface CampaignListResponse {
  data: Campaign[];
  nextCursor: string | null;
}

export interface UserDashboard {
  totalDonated: number;
  campaignsSupported: number;
  nextCursor: string | null;
  timeline: Array<{
    id: string;
    amount: number;
    campaign: string;
    createdAt: string;
  }>;
}

export interface UserCampaignAnalytics {
  _id: string;
  title: string;
  category: string;
  status: Campaign['status'];
  goalAmount: number;
  raisedAmount: number;
  createdAt: string;
  media: string[];
  donorsCount: number;
  lastDonationAt?: string;
}

export interface UserCampaignDashboard {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    successStories: number;
    totalRaised: number;
    avgProgress: number;
  };
  campaigns: UserCampaignAnalytics[];
}

export interface PendingDonationItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  transactionId?: string;
  verificationMethod?: 'transaction_id' | 'qr_code';
  screenshotUrl?: string;
  donorName?: string;
  createdAt: string;
}

export interface OrganizerPendingDonations {
  totalPending: number;
  donations: PendingDonationItem[];
}

export interface AdminOverview {
  totalDonated: number;
  donorsCount: number;
  campaignsApproved: number;
  usersCount: number;
}
