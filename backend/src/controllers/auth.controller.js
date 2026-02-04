const authService = require('../services/auth.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res, next) => {
  const result = await authService.register(req.body);
  res.status(201).json(ApiResponse.success(result, 'User registered successfully'));
});

const login = asyncHandler(async (req, res, next) => {
  const result = await authService.login(req.body);
  res.status(200).json(ApiResponse.success(result, 'Login successful'));
});

const logout = asyncHandler(async (req, res, next) => {
  // Implement logout logic (e.g., invalidate token)
  res.status(200).json(ApiResponse.success(null, 'Logout successful'));
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  res.status(200).json(ApiResponse.success(result, 'Token refreshed successfully'));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json(ApiResponse.success(null, 'Password reset email sent'));
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(200).json(ApiResponse.success(null, 'Password reset successful'));
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
