
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
  totalDonated: number;
  createdAt: string;
}

export interface Campaign {
  _id: string;
  title: string;
  category: string;
  story: string;
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
