const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { config } = require('../config/environment');
const { AppError } = require('../utils/appError');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const register = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id);

  return { user, token };
};

const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
};

const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    const newToken = generateToken(decoded.userId);
    return { token: newToken };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists
    return;
  }

  // TODO: Generate reset token and send email
  // const resetToken = crypto.randomBytes(32).toString('hex');
  // await sendPasswordResetEmail(user.email, resetToken);
};

const resetPassword = async (token, newPassword) => {
  // TODO: Verify reset token and update password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update user password in database
  // await prisma.user.update({ ... });
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
