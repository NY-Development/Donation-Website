import { FilterQuery } from 'mongoose';
import { UserDocument, UserModel } from './user.model';

export const userRepository = {
  create: (data: Partial<UserDocument>) => UserModel.create(data),
  findByEmail: (email: string) => UserModel.findOne({ email }).select('+password'),
  findById: (id: string) => UserModel.findById(id),
  findByIdLean: (id: string) => UserModel.findById(id).select('-password -refreshTokens').lean(),
  updateById: (id: string, data: Partial<UserDocument>) => UserModel.findByIdAndUpdate(id, data, { new: true }),
  addRefreshToken: (id: string, tokenId: string) =>
    UserModel.findByIdAndUpdate(id, { $addToSet: { refreshTokens: tokenId } }),
  removeRefreshToken: (id: string, tokenId: string) =>
    UserModel.findByIdAndUpdate(id, { $pull: { refreshTokens: tokenId } }),
  findOne: (filter: FilterQuery<UserDocument>) => UserModel.findOne(filter),
  count: () => UserModel.countDocuments()
};
