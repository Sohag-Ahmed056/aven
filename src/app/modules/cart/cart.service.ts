import ApiError from '../../error/AppError.js';
import { Cart } from './cart.model.js';
import { Product } from '../product/product.model.js';

const getCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const addToCart = async (
  userId: string,
  payload: { product: string; quantity: number; variant?: { name: string; value: string } }
) => {
  const product = await Product.findById(payload.product);
  if (!product) throw new ApiError(404, 'Product not found!');

  // Check product base stock
  if (product.stock < payload.quantity) {
    throw new ApiError(400, `Insufficient stock! Only ${product.stock} units available.`);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Find if product with same variant already exists in cart
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === payload.product &&
      (!payload.variant ||
        (item.variant?.name === payload.variant.name &&
          item.variant?.value === payload.variant.value))
  );

  if (itemIndex > -1) {
    // Increment quantity
    const newQty = (cart.items[itemIndex]?.quantity || 0) + payload.quantity;
    if (product.stock < newQty) {
      throw new ApiError(400, `Insufficient stock! Cannot add more. Total stock is ${product.stock}.`);
    }
    const item = cart.items[itemIndex];
    if (item) {
      item.quantity = newQty;
    }
  } else {
    // Add new item
    cart.items.push(payload as any);
  }

  await cart.save();
  return cart.populate('items.product');
};

const updateQuantity = async (userId: string, productId: string, quantity: number) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found!');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found!');

  if (product.stock < quantity) {
    throw new ApiError(400, `Insufficient stock! Only ${product.stock} units available.`);
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex === -1) throw new ApiError(404, 'Item not found in cart!');

  const item = cart.items[itemIndex];
  if (item) {
    item.quantity = quantity;
  }
  await cart.save();

  return cart.populate('items.product');
};

const removeItem = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found!');

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  return cart.populate('items.product');
};

const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found!');

  cart.items = [];
  await cart.save();

  return cart;
};

export const CartService = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
};
