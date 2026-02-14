import mongoose, { Document, Schema } from 'mongoose';

export type DonationStatus = 'pending' | 'succeeded' | 'failed';

export interface DonationDocument extends Document {
  user?: mongoose.Types.ObjectId;
  campaign: mongoose.Types.ObjectId;
  amount: number;
  paymentProvider: string;
  status: DonationStatus;
  donorName?: string;
  donorEmail?: string;
  paymentIntentId?: string;
  transactionId?: string;
  verificationMethod?: 'transaction_id' | 'qr_code';
  verificationSource?: 'QR_CODE' | 'TEXT_RECOGNITION' | 'MANUAL';
  verificationDetails?: Record<string, unknown>;
  receiptUrl?: string;
  receiptPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<DonationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    amount: { type: Number, required: true },
    paymentProvider: { type: String, required: true },
    status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
    donorName: { type: String, trim: true },
    donorEmail: { type: String, trim: true, lowercase: true },
    paymentIntentId: { type: String, index: true },
    transactionId: { type: String, index: true },
    verificationMethod: { type: String, enum: ['transaction_id', 'qr_code'] },
    verificationSource: { type: String, enum: ['QR_CODE', 'TEXT_RECOGNITION', 'MANUAL'] },
    verificationDetails: { type: Schema.Types.Mixed },
    receiptUrl: { type: String },
    receiptPublicId: { type: String }
  },
  { timestamps: true }
);

donationSchema.index({ campaign: 1, createdAt: -1 });

export const DonationModel = mongoose.model<DonationDocument>('Donation', donationSchema);
