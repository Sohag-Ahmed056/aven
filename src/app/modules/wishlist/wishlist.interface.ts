import type { Model, Types } from 'mongoose';

export type TWishlist = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IWishlistModel extends Model<TWishlist> {}
