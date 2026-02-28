import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ICookieConsent extends Document {
  userId?: Types.ObjectId;
  consentGiven: boolean;
  consentCategories: IConsentCategories;
  policyVersion: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ConsentCategoriesSchema = new Schema<IConsentCategories>({
  necessary: { type: Boolean, default: true },
  analytics: { type: Boolean, default: false },
  marketing: { type: Boolean, default: false },
});

const CookieConsentSchema = new Schema<ICookieConsent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  consentGiven: { type: Boolean, required: true },
  consentCategories: { type: ConsentCategoriesSchema, required: true },
  policyVersion: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

export default mongoose.model<ICookieConsent>('CookieConsent', CookieConsentSchema);
