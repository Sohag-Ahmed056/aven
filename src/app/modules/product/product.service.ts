import ApiError from '../../error/AppError.js';
import { Product } from './product.model.js';
import QueryBuilder from '../../builders/QueryBuilder.js';

const createProduct = async (payload: any) => {
  const existingName = await Product.findOne({ name: payload.name });
  if (existingName) throw new ApiError(409, 'Product name already exists!');

  const existingSku = await Product.findOne({ sku: payload.sku });
  if (existingSku) throw new ApiError(409, 'SKU already exists!');

  const product = await Product.create(payload);
  return product;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().populate('category').populate('subCategory').populate('brand'),
    query
  )
    .search(['name', 'description', 'sku', 'tags'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate('category')
    .populate('subCategory')
    .populate('brand');

  if (!product) throw new ApiError(404, 'Product not found!');
  return product;
};

const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug })
    .populate('category')
    .populate('subCategory')
    .populate('brand');

  if (!product) throw new ApiError(404, 'Product not found!');
  return product;
};

const updateProduct = async (id: string, payload: any) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found!');

  if (payload.name) {
    const existing = await Product.findOne({ name: payload.name, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'Product name already exists!');
  }

  if (payload.sku) {
    const existing = await Product.findOne({ sku: payload.sku, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'SKU already exists!');
  }

  Object.assign(product, payload);
  await product.save();

  return product;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found!');

  product.isDeleted = true;
  await product.save();

  return product;
};

const getRelatedProducts = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found!');

  const related = await Product.find({
    category: product.category,
    _id: { $ne: productId },
    isPublished: true,
  })
    .limit(5)
    .populate('category')
    .populate('brand');

  return related;
};

const getFeaturedProducts = async () => {
  const featured = await Product.find({ isFeatured: true, isPublished: true })
    .limit(10)
    .populate('category')
    .populate('brand');
  return featured;
};

const getTrendingProducts = async () => {
  const trending = await Product.find({ isPublished: true })
    .sort('-soldCount')
    .limit(10)
    .populate('category')
    .populate('brand');
  return trending;
};

const getLowStockProducts = async () => {
  const lowStock = await Product.find({ stock: { $lt: 5 } })
    .sort('stock')
    .populate('category')
    .populate('brand');
  return lowStock;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getLowStockProducts,
};
