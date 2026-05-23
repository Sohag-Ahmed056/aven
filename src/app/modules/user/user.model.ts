import { Schema, model } from 'mongoose';
import type { TUser, TAddress, TWallet, TLoginLog, IUserModel } from './user.interface.js';

const AddressSchema = new Schema<TAddress>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<TUser, IUserModel>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, unique: true, sparse: true },
    fullName: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'BANNED'],
      default: 'ACTIVE',
    },
    kycStatus: { type: String, default: 'PENDING' },
    avatarUrl: { type: String },
    referralCode: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    isSelfExcluded: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    emailVerifiedAt: { type: Date },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual field for Wallet relation
UserSchema.virtual('wallet', {
  ref: 'Wallet',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

// Statics implementation
UserSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+passwordHash');
};

UserSchema.statics.isUserExistsByUsername = async function (username: string) {
  return await this.findOne({ username }).select('+passwordHash');
};

export const User = model<TUser, IUserModel>('User', UserSchema);

// Wallet Schema & Model
const WalletSchema = new Schema<TWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    bonusBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'BDT' },
    totalDeposited: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    totalBet: { type: Number, default: 0 },
    totalWon: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Wallet = model<TWallet>('Wallet', WalletSchema);

// Login Log Schema & Model
const LoginLogSchema = new Schema<TLoginLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ipAddress: { type: String, required: true },
    success: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const LoginLog = model<TLoginLog>('LoginLog', LoginLogSchema);
