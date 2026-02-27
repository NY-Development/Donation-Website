
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { userRepository } from '../users/user.repository';
import { UserRole } from '../users/user.model';
import { sendOtpEmail } from '../../utils/mailer';
import { UserModel } from '../users/user.model';
import { env } from '../../config/env';

const SUPER_ADMIN_EMAILS = ['yamlaknegash96@gmail.com', 'mebasharew31@gmail.com'];

export const authService = {
  signup: async (payload: { name: string; email: string; password: string; role?: UserRole }) => {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw { status: 409, message: 'errors.emailInUse' };
    }

    let role = UserRole.DONOR;
    if (payload.role === UserRole.ORGANIZER) {
      role = UserRole.ORGANIZER;
    }
    if (SUPER_ADMIN_EMAILS.includes(payload.email)) {
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
  login: async (payload: { email: string; password: string; rememberMeDays?: number }) => {
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      throw { status: 401, message: 'errors.invalidCredentials' };
    }

    if (!user.emailVerified) {
      throw { status: 403, message: 'errors.emailNotVerified' };
    }

    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) {
      throw { status: 401, message: 'errors.invalidCredentials' };
    }

    const tokenId = uuidv4();
    await userRepository.addRefreshToken(user._id.toString(), tokenId);

    // Calculate expiration
    let expiresIn = env.JWT_EXPIRES_IN;
    let refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
    if (typeof payload.rememberMeDays === 'number' && payload.rememberMeDays > 0) {
      expiresIn = `${payload.rememberMeDays}d`;
      refreshExpiresIn = `${payload.rememberMeDays * 4}d`;
    }

    return {
      user,
      accessToken: signAccessToken({ userId: user._id.toString(), role: user.role }, expiresIn),
      refreshToken: signRefreshToken({ userId: user._id.toString(), role: user.role, tokenId }, refreshExpiresIn),
      expiresIn,
      refreshExpiresIn
    };
  },
  forgotPassword: async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { ok: true };
    }

    const temporary = uuidv4();
    const hashed = await bcrypt.hash(temporary, 12);
    await userRepository.updateById(user._id.toString(), {
      password: hashed,
      refreshTokens: []
    } as never);

    return { ok: true };
  },
  resetPassword: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 404, message: 'errors.userNotFound' };
    }

    const hashed = await bcrypt.hash(password, 12);
    await userRepository.updateById(user._id.toString(), {
      password: hashed,
      refreshTokens: []
    } as never);

    return { ok: true };
  },
  verifyOtp: async (payload: { email: string; otp: string }) => {
    const user = await UserModel.findOne({ email: payload.email }).select(
      '+emailVerificationOtpHash +emailVerificationOtpExpires'
    );

    if (!user || !user.emailVerificationOtpHash || !user.emailVerificationOtpExpires) {
      throw { status: 400, message: 'errors.invalidVerificationRequest' };
    }

    if (user.emailVerificationOtpExpires.getTime() < Date.now()) {
      throw { status: 400, message: 'errors.otpExpired' };
    }

    const isValid = await bcrypt.compare(payload.otp, user.emailVerificationOtpHash);
    if (!isValid) {
      throw { status: 400, message: 'errors.invalidOtp' };
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
      throw { status: 401, message: 'errors.invalidRefreshToken' };
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
