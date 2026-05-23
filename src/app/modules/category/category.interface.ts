import type { Model, Types } from 'mongoose';

export type TCategory = {
  name: string;
  slug: string;
  parent?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ICategoryModel extends Model<TCategory> {}
