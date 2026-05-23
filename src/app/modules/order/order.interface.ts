import type { Model, Types } from 'mongoose';
import type { TAddress } from '../user/user.interface.js';

export type TOrderItem = {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
};

export type TOrder = {
  user: Types.ObjectId;
  items: TOrderItem[];
  shippingAddress: TAddress;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  transactionId: string;
  sslSessionVal?: string;
  invoiceUrl?: string;
  paymentDetails?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IOrderModel extends Model<TOrder> {}
