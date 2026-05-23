import type { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { ProductService } from './product.service.js';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product fetched successfully!',
    data: result,
  });
});

const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await ProductService.getProductBySlug(slug as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product fetched successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.updateProduct(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getRelatedProducts(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Related products fetched successfully!',
    data: result,
  });
});

const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getFeaturedProducts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Featured products fetched successfully!',
    data: result,
  });
});

const getTrendingProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getTrendingProducts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trending products fetched successfully!',
    data: result,
  });
});

const getLowStockProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getLowStockProducts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Low stock products fetched successfully!',
    data: result,
  });
});

export const ProductController = {
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
