import mongoose, { Document, Schema } from 'mongoose';

export type CampaignStatus = 'draft' | 'pending_verification' | 'approved' | 'rejected' | 'paused' | 'closed';
export type FundingStyle = 'keep' | 'all_or_nothing';

export interface CampaignDocument extends Document {
  title: string;
  category: string;
  story: string;
  location?: string;
  urgent?: boolean;
  fundingStyle: FundingStyle;
  goalAmount: number;
  raisedAmount: number;
  cbeAccountNumber: string;
  status: CampaignStatus;
  media: string[];
  isSuccessStory?: boolean;
  goalReachedAt?: Date;
  deadline?: Date;
  closedAt?: Date;
  organizer: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<CampaignDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    story: { type: String, required: true },
    location: { type: String, trim: true },
    urgent: { type: Boolean, default: false },
    fundingStyle: { type: String, enum: ['keep', 'all_or_nothing'], default: 'keep' },
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    cbeAccountNumber: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'pending_verification', 'approved', 'rejected', 'paused', 'closed'],
      default: 'draft',
      index: true
    },
    media: { type: [String], default: [] },
    isSuccessStory: { type: Boolean, default: false, index: true },
    goalReachedAt: { type: Date },
    deadline: { type: Date },
    closedAt: { type: Date },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, createdAt: -1 });

export const CampaignModel = mongoose.model<CampaignDocument>('Campaign', campaignSchema);
