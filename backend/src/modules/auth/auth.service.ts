import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { userRepository } from '../users/user.repository';
import { UserRole } from '../users/user.model';

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
      role
    });

    const tokenId = uuidv4();
    await userRepository.addRefreshToken(user._id.toString(), tokenId);

    return {
      user,
      accessToken: signAccessToken({ userId: user._id.toString(), role: user.role }),
      refreshToken: signRefreshToken({ userId: user._id.toString(), role: user.role, tokenId })
    };
  },
  login: async (payload: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
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
