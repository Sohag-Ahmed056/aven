import ApiError from '../../error/AppError.js';
import { Coupon } from './coupon.model.js';
import QueryBuilder from '../../builders/QueryBuilder.js';

const createCoupon = async (payload: any) => {
  const existing = await Coupon.findOne({ code: payload.code.toUpperCase() });
  if (existing) throw new ApiError(409, 'Coupon code already exists!');

  const coupon = await Coupon.create(payload);
  return coupon;
};

const getAllCoupons = async (query: Record<string, unknown>) => {
  const couponQuery = new QueryBuilder(Coupon.find(), query)
    .search(['code'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await couponQuery.modelQuery;
  const meta = await couponQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getCouponById = async (id: string) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found!');
  return coupon;
};

const updateCoupon = async (id: string, payload: any) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found!');

  if (payload.code) {
    const existing = await Coupon.findOne({ code: payload.code.toUpperCase(), _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'Coupon code already exists!');
  }

  Object.assign(coupon, payload);
  await coupon.save();

  return coupon;
};

const deleteCoupon = async (id: string) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found!');
  return coupon;
};

const validateCoupon = async (userId: string, code: string, totalAmount: number) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Coupon not found!');
  if (!coupon.isActive) throw new ApiError(400, 'Coupon is inactive!');
  
  if (new Date(coupon.expiry).getTime() < Date.now()) {
    throw new ApiError(400, 'Coupon has expired!');
  }
  
  if (coupon.usageCount >= coupon.limit) {
    throw new ApiError(400, 'Coupon usage limit has been reached!');
  }

  // User-specific validation
  if (coupon.userSpecific && coupon.userSpecific.length > 0) {
    const isAllowed = coupon.userSpecific.some((id) => id.toString() === userId);
    if (!isAllowed) {
      throw new ApiError(403, 'This coupon is not valid for your account!');
    }
  }

  // Minimum purchase check
  if (totalAmount < coupon.minPurchase) {
    throw new ApiError(
      400,
      `Minimum purchase amount of BDT ${coupon.minPurchase} is required to apply this coupon!`
    );
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'FLAT') {
    discount = coupon.value;
  } else {
    discount = (totalAmount * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  // Ensure discount does not exceed total price
  if (discount > totalAmount) {
    discount = totalAmount;
  }

  return {
    code: coupon.code,
    type: coupon.type,
    discount,
    minPurchase: coupon.minPurchase,
  };
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
