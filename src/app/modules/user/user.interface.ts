import type { Model, Types, HydratedDocument } from 'mongoose';

export type TUserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type TUserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export type TAddress = {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
};

export type TUser = {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  passwordHash: string;
  role: TUserRole;
  status: TUserStatus;
  kycStatus: string;
  avatarUrl?: string;
  referralCode?: string;
  twoFactorEnabled: boolean;
  isSelfExcluded: boolean;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  addresses: TAddress[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<HydratedDocument<TUser> | null>;
  isUserExistsByUsername(username: string): Promise<HydratedDocument<TUser> | null>;
}

export type TWallet = {
  user: Types.ObjectId;
  balance: number;
  bonusBalance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBet: number;
  totalWon: number;
};

export type TLoginLog = {
  user: Types.ObjectId;
  ipAddress: string;
  success: boolean;
  createdAt?: Date;
};
