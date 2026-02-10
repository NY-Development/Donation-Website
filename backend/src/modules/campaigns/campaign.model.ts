import mongoose, { Document, Schema } from 'mongoose';

export type CampaignStatus = 'draft' | 'pending_verification' | 'approved' | 'rejected';

export interface CampaignDocument extends Document {
  title: string;
  category: string;
  story: string;
  location?: string;
  urgent?: boolean;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  media: string[];
  organizer: mongoose.Types.ObjectId;
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
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'pending_verification', 'approved', 'rejected'],
      default: 'draft',
      index: true
    },
    media: { type: [String], default: [] },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, createdAt: -1 });

export const CampaignModel = mongoose.model<CampaignDocument>('Campaign', campaignSchema);
