const userService = require('../services/user.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserById(req.user.id);
  res.status(200).json(ApiResponse.success(user, 'User retrieved successfully'));
});

const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await userService.updateUser(req.user.id, req.body);
  res.status(200).json(ApiResponse.success(user, 'User updated successfully'));
});

const deleteCurrentUser = asyncHandler(async (req, res, next) => {
  await userService.deleteUser(req.user.id);
  res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const users = await userService.getAllUsers(
    Number(page) || 1,
    Number(limit) || 10
  );
  res.status(200).json(ApiResponse.success(users, 'Users retrieved successfully'));
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(ApiResponse.success(user, 'User retrieved successfully'));
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(user, 'User updated successfully'));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
});

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
