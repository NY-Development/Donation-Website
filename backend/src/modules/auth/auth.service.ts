import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { userRepository } from '../users/user.repository';
import { UserRole } from '../users/user.model';
import { sendOtpEmail } from '../../utils/mailer';
import { UserModel } from '../users/user.model';

const SUPER_ADMIN_EMAIL = 'yamlaknegash96@gmail.com';

export const authService = {
  signup: async (payload: { name: string; email: string; password: string; role?: UserRole }) => {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw { status: 409, message: 'Email already in use' };
    }

    let role = UserRole.DONOR;
    if (payload.role === UserRole.ORGANIZER) {
      role = UserRole.ORGANIZER;
    }
    if (payload.email === SUPER_ADMIN_EMAIL) {
      role = UserRole.ADMIN;
    }

    const hashed = await bcrypt.hash(payload.password, 12);
    const user = await userRepository.create({
      name: payload.name,
      email: payload.email,
      password: hashed,
      role,
      emailVerified: false
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await userRepository.updateById(user._id.toString(), {
      emailVerificationOtpHash: otpHash,
      emailVerificationOtpExpires: otpExpires
    });

    await sendOtpEmail(user.email, otp);

    return {
      user,
      requiresOtp: true
    };
  },
  login: async (payload: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    if (!user.emailVerified) {
      throw { status: 403, message: 'Email not verified. Please verify OTP.' };
    }

    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const tokenId = uuidv4();
    await userRepository.addRefreshToken(user._id.toString(), tokenId);

    return {
      user,
      accessToken: signAccessToken({ userId: user._id.toString(), role: user.role }),
      refreshToken: signRefreshToken({ userId: user._id.toString(), role: user.role, tokenId })
    };
  },
  verifyOtp: async (payload: { email: string; otp: string }) => {
    const user = await UserModel.findOne({ email: payload.email }).select(
      '+emailVerificationOtpHash +emailVerificationOtpExpires'
    );

    if (!user || !user.emailVerificationOtpHash || !user.emailVerificationOtpExpires) {
      throw { status: 400, message: 'Invalid verification request' };
    }

    if (user.emailVerificationOtpExpires.getTime() < Date.now()) {
      throw { status: 400, message: 'OTP has expired' };
    }

    const isValid = await bcrypt.compare(payload.otp, user.emailVerificationOtpHash);
    if (!isValid) {
      throw { status: 400, message: 'Invalid OTP' };
    }

    user.emailVerified = true;
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpires = undefined;
    await user.save();

    return user;
  },
  refresh: async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.userId);

    if (!user || !payload.tokenId || !user.refreshTokens.includes(payload.tokenId)) {
      throw { status: 401, message: 'Invalid refresh token' };
    }

    await userRepository.removeRefreshToken(user._id.toString(), payload.tokenId);
    const newTokenId = uuidv4();
    await userRepository.addRefreshToken(user._id.toString(), newTokenId);

    return {
      accessToken: signAccessToken({ userId: user._id.toString(), role: user.role }),
      refreshToken: signRefreshToken({ userId: user._id.toString(), role: user.role, tokenId: newTokenId })
    };
  },
  logout: async (userId: string, tokenId?: string) => {
    if (tokenId) {
      await userRepository.removeRefreshToken(userId, tokenId);
    }
  }
};
