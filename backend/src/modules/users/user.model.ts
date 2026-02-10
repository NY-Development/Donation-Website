import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'donor' | 'organizer' | 'admin';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  totalDonated: number;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['donor', 'organizer', 'admin'], default: 'donor' },
    totalDonated: { type: Number, default: 0 },
    refreshTokens: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
