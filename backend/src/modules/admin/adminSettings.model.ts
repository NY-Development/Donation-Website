import mongoose, { Document, Schema } from 'mongoose';

type NotificationSettings = {
  largeDonation: boolean;
  newCampaignVerification: boolean;
};

export interface AdminSettingsDocument extends Document {
  platformName: string;
  supportEmail: string;
  fontFamily: 'Source Sans Pro' | 'Roboto' | 'Proxima Nova' | 'Lato';
  maintenanceMode: boolean;
  platformFeePercent: number;
  settlementCurrency: string;
  enforce2fa: boolean;
  sessionTimeoutMinutes: number;
  auditLogging: boolean;
  notifications: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

const adminSettingsSchema = new Schema<AdminSettingsDocument>(
  {
    platformName: { type: String, default: 'ImpactGive' },
    supportEmail: { type: String, default: 'support@impactgive.org' },
    fontFamily: { type: String, default: 'Source Sans Pro' },
    maintenanceMode: { type: Boolean, default: false },
    platformFeePercent: { type: Number, default: 2.5 },
    settlementCurrency: { type: String, default: 'USD' },
    enforce2fa: { type: Boolean, default: true },
    sessionTimeoutMinutes: { type: Number, default: 60 },
    auditLogging: { type: Boolean, default: true },
    notifications: {
      largeDonation: { type: Boolean, default: true },
      newCampaignVerification: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const AdminSettingsModel = mongoose.model<AdminSettingsDocument>(
  'AdminSettings',
  adminSettingsSchema
);
