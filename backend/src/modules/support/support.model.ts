import mongoose, { Document, Schema } from 'mongoose';

export type SupportRequestStatus = 'open' | 'resolved';

export interface SupportReply {
  subject: string;
  content: string;
  sentBy?: mongoose.Types.ObjectId;
  sentAt: Date;
}

export interface SupportRequestDocument extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportRequestStatus;
  replies: SupportReply[];
  createdAt: Date;
  updatedAt: Date;
}

const supportReplySchema = new Schema<SupportReply>(
  {
    subject: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const supportRequestSchema = new Schema<SupportRequestDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true },
    replies: { type: [supportReplySchema], default: [] }
  },
  { timestamps: true }
);

supportRequestSchema.index({ createdAt: -1 });

export const SupportRequestModel = mongoose.model<SupportRequestDocument>('SupportRequest', supportRequestSchema);
