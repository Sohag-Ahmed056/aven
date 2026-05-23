import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import ApiError from '../../error/AppError.js';
import { jwtHelper } from '../../helper/jwtHelper.js';
import { User, Wallet, LoginLog } from '../user/user.model.js';
import config from '../../../config/index.js';

const register = async (payload: {
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  password: string;
}) => {
  const existingEmail = await User.findOne({ email: payload.email });
  if (existingEmail) throw new ApiError(409, 'Email already registered!');

  const existingUsername = await User.findOne({ username: payload.username });
  if (existingUsername) throw new ApiError(409, 'Username already taken!');

  if (payload.phone) {
    const existingPhone = await User.findOne({ phone: payload.phone });
    if (existingPhone) throw new ApiError(409, 'Phone already registered!');
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.bcrypt_salt_rounds);

  const session = await mongoose.startSession();
  let newUser;

  try {
    session.startTransaction();

    const createdUsers = await User.create(
      [
        {
          username: payload.username,
          email: payload.email,
          phone: payload.phone,
          fullName: payload.fullName,
          passwordHash: hashedPassword,
        },
      ],
      { session }
    );

    newUser = createdUsers[0];
    if (!newUser) {
      throw new ApiError(500, 'Failed to create user account!');
    }

    await Wallet.create(
      [
        {
          user: newUser._id,
          balance: 0,
          currency: 'BDT',
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  const userObject = {
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    status: newUser.status,
    kycStatus: newUser.kycStatus,
    createdAt: newUser.createdAt,
  };

  const accessToken = jwtHelper.generateToken(
    { id: userObject.id, email: userObject.email, role: userObject.role },
    config.jwt_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = jwtHelper.generateToken(
    { id: userObject.id, email: userObject.email, role: userObject.role },
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return { user: userObject, accessToken, refreshToken };
};

const login = async (payload: { email: string; password: string; ip?: string }) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) throw new ApiError(404, 'Credentials are incorrect!');
  if (user.status === 'BANNED') throw new ApiError(403, 'Your account has been banned!');
  if (user.status === 'SUSPENDED') throw new ApiError(403, 'Your account is suspended!');

  const isCorrectPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isCorrectPassword) throw new ApiError(401, 'Credentials are incorrect!');

  user.lastLoginAt = new Date();
  await user.save();

  await LoginLog.create({
    user: user._id,
    ipAddress: payload.ip || '0.0.0.0',
    success: true,
  });

  const accessToken = jwtHelper.generateToken(
    { id: user._id.toString(), email: user.email, role: user.role },
    config.jwt_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = jwtHelper.generateToken(
    { id: user._id.toString(), email: user.email, role: user.role },
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
    },
  };
};

const refreshToken = async (token: string) => {
  let decoded: { id: string; email: string; role: string };
  try {
    decoded = jwtHelper.verifyToken(token, config.jwt_refresh_secret) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token!');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(404, 'User not found!');
  if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
    throw new ApiError(403, 'Account access denied!');
  }

  const accessToken = jwtHelper.generateToken(
    { id: user._id.toString(), email: user.email, role: user.role },
    config.jwt_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found!');

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) throw new ApiError(401, 'Old password is incorrect!');

  user.passwordHash = await bcrypt.hash(newPassword, config.bcrypt_salt_rounds);
  await user.save();
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No account found with this email!');

  const resetToken = jwtHelper.generateToken(
    { id: user._id.toString(), email: user.email },
    config.jwt_secret,
    '15m'
  );

  // TODO: send reset email using sendEmail helper
  // await sendEmail({ to: user.email, subject: "Password Reset Request", html: ... })

  return { resetToken }; // returned in response for development / seeding
};

const resetPassword = async (token: string, newPassword: string) => {
  let decoded: { id: string };
  try {
    decoded = jwtHelper.verifyToken(token, config.jwt_secret) as { id: string };
  } catch {
    throw new ApiError(401, 'Reset token is invalid or expired!');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(404, 'User not found!');

  user.passwordHash = await bcrypt.hash(newPassword, config.bcrypt_salt_rounds);
  await user.save();
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).populate('wallet');
  if (!user) throw new ApiError(404, 'User not found!');
  return user;
};

export const AuthService = {
  register,
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};