import { Schema, model } from 'mongoose';
import type { TCart, TCartItem, ICartModel } from './cart.interface.js';

const CartItemSchema = new Schema<TCartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    name: { type: String },
    value: { type: String },
  },
});

const CartSchema = new Schema<TCart, ICartModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Cart = model<TCart, ICartModel>('Cart', CartSchema);
