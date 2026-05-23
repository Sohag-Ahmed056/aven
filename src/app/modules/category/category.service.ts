import { Types } from 'mongoose';
import ApiError from '../../error/AppError.js';
import { Category } from './category.model.js';

const createCategory = async (payload: { name: string; parent?: string | null }) => {
  const existing = await Category.findOne({ name: payload.name });
  if (existing) throw new ApiError(409, 'Category with this name already exists!');

  const category = await Category.create({
    name: payload.name,
    parent: payload.parent ? new Types.ObjectId(payload.parent) : undefined,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find().populate('parent');
  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id).populate('parent');
  if (!category) throw new ApiError(404, 'Category not found!');
  return category;
};

const updateCategory = async (id: string, payload: { name?: string; parent?: string | null }) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found!');

  if (payload.name) {
    const existing = await Category.findOne({ name: payload.name, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'Category with this name already exists!');
    category.name = payload.name;
  }

  if (payload.parent !== undefined) {
    category.parent = payload.parent ? new Types.ObjectId(payload.parent) : undefined;
  }

  await category.save();
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found!');

  // Check if any subcategory refers to this category as a parent
  const subCategoryExists = await Category.findOne({ parent: id });
  if (subCategoryExists) {
    throw new ApiError(400, 'Cannot delete category that has child subcategories!');
  }

  category.isDeleted = true;
  await category.save();
  return category;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
