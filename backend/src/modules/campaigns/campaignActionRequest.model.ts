import mongoose, { Document, Schema } from 'mongoose';

export type CampaignActionType = 'pause' | 'delete';
export type CampaignActionStatus = 'pending' | 'approved' | 'rejected';

export interface CampaignActionRequestDocument extends Document {
  campaign: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  action: CampaignActionType;
  message: string;
  status: CampaignActionStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const campaignActionRequestSchema = new Schema<CampaignActionRequestDocument>(
  {
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, enum: ['pause', 'delete'], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String }
  },
  { timestamps: true }
);

campaignActionRequestSchema.index({ status: 1, createdAt: -1 });

export const CampaignActionRequestModel = mongoose.model<CampaignActionRequestDocument>(
  'CampaignActionRequest',
  campaignActionRequestSchema
);
