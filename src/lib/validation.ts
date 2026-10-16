// ============================================
// BUYMECART - Zod Validation Schemas
// Server-side input validation for all API endpoints
// ============================================

import { z } from "zod";

// ---- Common ----

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// ---- Auth ----

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .trim(),
    email: z
      .string()
      .email("Invalid email address")
      .max(255)
      .trim()
      .toLowerCase(),
    phone: z
      .string()
      .optional()
      .nullable()
      .transform((val) => {
        if (!val) return undefined;
        const cleaned = val.replace(/[\s\-\(\)\+]/g, "").replace(/^91/, "").replace(/^0/, "");
        return cleaned || undefined;
      })
      .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
        message: "Invalid Indian mobile number (must be 10 digits starting with 6-9)",
      }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128),
    confirmPassword: z.string().optional(),
    acceptTerms: z
      .boolean()
      .optional()
      .default(true)
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// ---- Address ----

export const addressSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  addressLine1: z.string().min(5, "Address is too short").max(500).trim(),
  addressLine2: z.string().max(500).trim().optional(),
  landmark: z.string().max(200).trim().optional(),
  city: z.string().min(2).max(100).trim(),
  state: z.string().min(2).max(100).trim(),
  pinCode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  country: z.string().default("India"),
  addressType: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().default(false),
});

// ---- Product ----

export const productSchema = z.object({
  name: z.string().min(3).max(500).trim(),
  description: z.string().max(10000).trim().optional(),
  shortDescription: z.string().max(500).trim().optional(),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  mrpPaise: z.number().int().min(100, "MRP must be at least ₹1"),
  sellingPricePaise: z.number().int().min(100, "Price must be at least ₹1"),
  costPricePaise: z.number().int().min(0).optional(),
  taxCategory: z
    .enum(["GST_0", "GST_5", "GST_12", "GST_18", "GST_28"])
    .default("GST_18"),
  hsnCode: z.string().max(20).optional(),
  weight: z.number().min(0).optional(),
  dimensionLength: z.number().min(0).optional(),
  dimensionWidth: z.number().min(0).optional(),
  dimensionHeight: z.number().min(0).optional(),
  isReturnable: z.boolean().default(true),
  returnWindowDays: z.number().int().min(0).max(30).default(7),
  warrantyMonths: z.number().int().min(0).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.array(z.string()).default([]),
  isCodEligible: z.boolean().default(true),
  requiresShipping: z.boolean().default(true),
  freeShipping: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

export const productVariantSchema = z.object({
  name: z.string().min(1).max(200),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  material: z.string().max(100).optional(),
  capacity: z.string().max(100).optional(),
  mrpPaise: z.number().int().min(100).optional(),
  sellingPricePaise: z.number().int().min(100).optional(),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().min(0).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

// ---- Cart ----

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(10),
});

// ---- Checkout / Order ----

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Delivery address is required"),
  paymentMethod: z.enum(["ONLINE", "COD"]),
  couponCode: z.string().optional(),
  deliveryInstructions: z.string().max(500).optional(),
  idempotencyKey: z.string().min(1, "Idempotency key is required"),
});

// ---- Review ----

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).trim().optional(),
  body: z.string().max(5000).trim().optional(),
});

// ---- Coupon ----

export const couponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(50)
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, numbers, hyphens, underscores"),
  description: z.string().max(500).optional(),
  type: z.enum(["FIXED_AMOUNT", "PERCENTAGE", "FREE_SHIPPING"]),
  valuePaise: z.number().int().min(0).optional(),
  valuePercent: z.number().min(0).max(100).optional(),
  minOrderPaise: z.number().int().min(0).optional(),
  maxDiscountPaise: z.number().int().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  usagePerUser: z.number().int().min(1).default(1),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
});

// ---- Category ----

export const categorySchema = z.object({
  name: z.string().min(2).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  parentId: z.string().optional().nullable(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
});

// ---- Profile ----

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
    .optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

// ---- Search ----

export const searchSchema = z.object({
  q: z.string().max(200).trim().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "popular", "rating"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(20),
});

// ---- Types ----

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
