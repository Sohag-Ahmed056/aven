import { Schema, model } from 'mongoose';
import type { TWishlist, IWishlistModel } from './wishlist.interface.js';

const WishlistSchema = new Schema<TWishlist, IWishlistModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = model<TWishlist, IWishlistModel>('Wishlist', WishlistSchema);
