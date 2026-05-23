import ApiError from '../../error/AppError.js';
import { Wishlist } from './wishlist.model.js';
import { Product } from '../product/product.model.js';

const getWishlist = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

const addToWishlist = async (userId: string, productId: string) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found!');

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  // Prevent duplicates
  if (wishlist.products.includes(productId as any)) {
    throw new ApiError(400, 'Product already in wishlist!');
  }

  wishlist.products.push(productId as any);
  await wishlist.save();

  return wishlist.populate('products');
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found!');

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  await wishlist.save();

  return wishlist.populate('products');
};

export const WishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
