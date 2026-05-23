import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { BrandService } from './brand.service.js';

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrand(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Brand created successfully!',
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getAllBrands(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brands fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.getBrandById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand fetched successfully!',
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.updateBrand(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand updated successfully!',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.deleteBrand(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brand deleted successfully!',
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
