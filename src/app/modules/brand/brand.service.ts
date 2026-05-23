import ApiError from '../../error/AppError.js';
import { Brand } from './brand.model.js';
import QueryBuilder from '../../builders/QueryBuilder.js';

const createBrand = async (payload: { name: string; logo?: string; description?: string }) => {
  const existing = await Brand.findOne({ name: payload.name });
  if (existing) throw new ApiError(409, 'Brand with this name already exists!');

  const brand = await Brand.create(payload);
  return brand;
};

const getAllBrands = async (query: Record<string, unknown>) => {
  const brandQuery = new QueryBuilder(Brand.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await brandQuery.modelQuery;
  const meta = await brandQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getBrandById = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) throw new ApiError(404, 'Brand not found!');
  return brand;
};

const updateBrand = async (id: string, payload: { name?: string; logo?: string; description?: string }) => {
  const brand = await Brand.findById(id);
  if (!brand) throw new ApiError(404, 'Brand not found!');

  if (payload.name) {
    const existing = await Brand.findOne({ name: payload.name, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'Brand with this name already exists!');
  }

  Object.assign(brand, payload);
  await brand.save();

  return brand;
};

const deleteBrand = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) throw new ApiError(404, 'Brand not found!');

  brand.isDeleted = true;
  await brand.save();

  return brand;
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
