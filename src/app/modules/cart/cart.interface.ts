import type { Model, Types } from 'mongoose';

export type TCartItem = {
  product: Types.ObjectId;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
};

export type TCart = {
  user: Types.ObjectId;
  items: TCartItem[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ICartModel extends Model<TCart> {}
