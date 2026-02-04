
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  raisedAmount: number;
  goalAmount: number;
  imageUrl: string;
  organizer: string;
  location?: string;
  urgent?: boolean;
  verified?: boolean;
}

export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  donorName: string;
  timestamp: string;
  isAnonymous: boolean;
}
