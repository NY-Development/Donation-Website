
export type UserRole = 'donor' | 'organizer' | 'admin';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface UserProfile {
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
  status: 'draft' | 'pending_verification' | 'approved' | 'rejected';
  media: string[];
  organizer: string;
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

export interface AdminOverview {
  totalDonated: number;
  donorsCount: number;
  campaignsApproved: number;
  usersCount: number;
}
