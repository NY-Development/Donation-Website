import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  DONOR = 'donor',
  ORGANIZER = 'organizer',
  ADMIN = 'admin'
}

type VerificationAsset = {
  publicId?: string;
  format?: string;
};

type OrganizerVerification = {
  idFront?: VerificationAsset;
  idBack?: VerificationAsset;
  livePhoto?: VerificationAsset;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerificationOtpHash?: string;
  emailVerificationOtpExpires?: Date;
  role: UserRole;
  totalDonated: number;
  isOrganizerVerified: boolean;
  organizerVerification: OrganizerVerification;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationOtpHash: { type: String, select: false },
    emailVerificationOtpExpires: { type: Date, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.DONOR },
    totalDonated: { type: Number, default: 0 },
    isOrganizerVerified: { type: Boolean, default: false },
    organizerVerification: {
      idFront: {
        publicId: { type: String },
        format: { type: String }
      },
      idBack: {
        publicId: { type: String },
        format: { type: String }
      },
      livePhoto: {
        publicId: { type: String },
        format: { type: String }
      },
      submittedAt: { type: Date },
      reviewedAt: { type: Date },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      rejectionReason: { type: String }
    },
    refreshTokens: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
