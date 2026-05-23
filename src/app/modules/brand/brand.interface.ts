import type { Model } from 'mongoose';

export type TBrand = {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IBrandModel extends Model<TBrand> {}
