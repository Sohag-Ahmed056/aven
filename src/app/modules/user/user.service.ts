import ApiError from '../../error/AppError.js';
import { User } from './user.model.js';
import { uploadToCloudinary } from '../../utils/cloudinary.js';
import QueryBuilder from '../../builders/QueryBuilder.js';

const updateProfile = async (userId: string, payload: { fullName?: string; phone?: string; twoFactorEnabled?: boolean; isSelfExcluded?: boolean }) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  // Avoid updating sensitive fields here
  Object.assign(user, payload);
  await user.save();

  return user;
};

const uploadAvatar = async (userId: string, filePath: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  // Upload to Cloudinary
  const result = await uploadToCloudinary(filePath, 'avatars');
  user.avatarUrl = result.url;
  await user.save();

  return user;
};

const addAddress = async (userId: string, addressPayload: { name: string; phone: string; street: string; city: string; state: string; zipCode: string; country: string; isDefault?: boolean }) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  // If isDefault is true, set all other addresses to false
  if (addressPayload.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(addressPayload);
  await user.save();

  return user.addresses;
};

const removeAddress = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== addressId);
  await user.save();

  return user.addresses;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find().populate('wallet'), query)
    .search(['username', 'email', 'fullName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const changeRole = async (userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  user.role = role;
  await user.save();

  return user;
};

const changeStatus = async (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BANNED') => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found!');

  user.status = status;
  await user.save();

  return user;
};

export const UserService = {
  updateProfile,
  uploadAvatar,
  addAddress,
  removeAddress,
  getAllUsers,
  changeRole,
  changeStatus,
};
