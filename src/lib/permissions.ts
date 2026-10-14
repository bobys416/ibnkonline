// ============================================
// BUYMECART - RBAC (Role-Based Access Control)
// Server-side permission enforcement
// ============================================

import prisma from "@/lib/db";
import type { TokenPayload } from "@/lib/auth";

// ---- Permission Constants ----
// Module.Action format for granular control

export const PERMISSIONS = {
  // Products
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",
  PRODUCTS_VIEW_ALL: "products.view_all",
  PRODUCTS_PUBLISH: "products.publish",
  PRODUCTS_APPROVE: "products.approve",
  PRODUCTS_SUBMIT: "products.submit_for_approval",
  PRODUCTS_UNLIST_REQUEST: "products.request_unlist",
  PRODUCTS_UNLIST: "products.unlist",
  PRODUCTS_ARCHIVE: "products.archive",

  // Categories
  CATEGORIES_MANAGE: "categories.manage",

  // Inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_MANAGE: "inventory.manage",

  // Merchants
  MERCHANTS_VIEW_ALL: "merchants.view_all",
  MERCHANTS_ONBOARD: "merchants.onboard",
  MERCHANTS_APPROVE: "merchants.approve",
  MERCHANTS_REJECT: "merchants.reject",
  MERCHANTS_SUSPEND: "merchants.suspend",
  MERCHANTS_EDIT: "merchants.edit",

  // Distributors & Area Distributors
  DISTRIBUTORS_VIEW_ALL: "distributors.view_all",
  DISTRIBUTORS_MANAGE: "distributors.manage",
  AREA_DISTRIBUTORS_MANAGE: "area_distributors.manage",

  // Approvals
  APPROVALS_VIEW_ALL: "approvals.view_all",
  APPROVALS_DECIDE: "approvals.decide",

  // Orders
  ORDERS_VIEW_OWN: "orders.view_own",
  ORDERS_VIEW_ALL: "orders.view_all",
  ORDERS_MANAGE: "orders.manage",
  ORDERS_CANCEL: "orders.cancel",

  // Payments & Financial Ledger
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_MANAGE: "payments.manage",
  PAYMENTS_REFUND: "payments.refund",
  TRANSACTIONS_VIEW_ALL: "transactions.view_all",
  SETTLEMENTS_VIEW_ALL: "settlements.view_all",
  SETTLEMENTS_PROCESS: "settlements.process",

  // Users
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  USERS_SUSPEND: "users.suspend",

  // Reviews
  REVIEWS_CREATE: "reviews.create",
  REVIEWS_MODERATE: "reviews.moderate",

  // Coupons
  COUPONS_MANAGE: "coupons.manage",

  // Settings
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",

  // Banners
  BANNERS_MANAGE: "banners.manage",

  // Analytics
  ANALYTICS_VIEW: "analytics.view",

  // Audit
  AUDIT_VIEW: "audit.view",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ---- System Roles ----

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "super_admin",
  MASTER_ADMIN: "master_admin",
  ADMIN: "admin",
  PRODUCT_OPERATIONS: "product_operations",
  MERCHANT_OPERATIONS: "merchant_operations",
  PRODUCT_MANAGER: "product_manager",
  PRODUCT_EDITOR: "product_editor",
  CATALOGUE_APPROVER: "catalogue_approver",
  INVENTORY_MANAGER: "inventory_manager",
  ORDER_MANAGER: "order_manager",
  CUSTOMER_SUPPORT: "customer_support",
  FINANCE_OPS: "finance_ops",
  DISTRIBUTOR_USER: "distributor_user",
  AREA_DISTRIBUTOR_USER: "area_distributor_user",
  ANALYST: "analyst",
  CUSTOMER: "customer",
} as const;

// ---- Role → Permission mapping ----

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [SYSTEM_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // Full access
  [SYSTEM_ROLES.MASTER_ADMIN]: Object.values(PERMISSIONS), // Full executive control center access
  [SYSTEM_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [SYSTEM_ROLES.PRODUCT_OPERATIONS]: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_VIEW_ALL,
    PERMISSIONS.PRODUCTS_SUBMIT,
    PERMISSIONS.PRODUCTS_UNLIST_REQUEST,
    PERMISSIONS.PRODUCTS_ARCHIVE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.CATEGORIES_MANAGE,
  ],
  [SYSTEM_ROLES.MERCHANT_OPERATIONS]: [
    PERMISSIONS.MERCHANTS_VIEW_ALL,
    PERMISSIONS.MERCHANTS_ONBOARD,
    PERMISSIONS.MERCHANTS_EDIT,
  ],
  [SYSTEM_ROLES.PRODUCT_MANAGER]: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.PRODUCTS_VIEW_ALL,
    PERMISSIONS.PRODUCTS_PUBLISH,
    PERMISSIONS.PRODUCTS_APPROVE,
    PERMISSIONS.CATEGORIES_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.REVIEWS_MODERATE,
  ],
  [SYSTEM_ROLES.PRODUCT_EDITOR]: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_VIEW_ALL,
    PERMISSIONS.INVENTORY_VIEW,
  ],
  [SYSTEM_ROLES.CATALOGUE_APPROVER]: [
    PERMISSIONS.PRODUCTS_VIEW_ALL,
    PERMISSIONS.PRODUCTS_APPROVE,
    PERMISSIONS.PRODUCTS_PUBLISH,
    PERMISSIONS.APPROVALS_VIEW_ALL,
    PERMISSIONS.APPROVALS_DECIDE,
  ],
  [SYSTEM_ROLES.INVENTORY_MANAGER]: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.PRODUCTS_VIEW_ALL,
  ],
  [SYSTEM_ROLES.ORDER_MANAGER]: [
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.PAYMENTS_VIEW,
  ],
  [SYSTEM_ROLES.CUSTOMER_SUPPORT]: [
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.REVIEWS_MODERATE,
  ],
  [SYSTEM_ROLES.FINANCE_OPS]: [
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_MANAGE,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.TRANSACTIONS_VIEW_ALL,
    PERMISSIONS.SETTLEMENTS_VIEW_ALL,
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [SYSTEM_ROLES.DISTRIBUTOR_USER]: [
    PERMISSIONS.DISTRIBUTORS_VIEW_ALL,
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.MERCHANTS_VIEW_ALL,
  ],
  [SYSTEM_ROLES.AREA_DISTRIBUTOR_USER]: [
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.MERCHANTS_VIEW_ALL,
  ],
  [SYSTEM_ROLES.ANALYST]: [
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.PRODUCTS_VIEW_ALL,
    PERMISSIONS.PAYMENTS_VIEW,
  ],
  [SYSTEM_ROLES.CUSTOMER]: [
    PERMISSIONS.ORDERS_VIEW_OWN,
    PERMISSIONS.REVIEWS_CREATE,
  ],
};

// ---- Permission Checking ----

/**
 * Check if a user has a specific permission.
 * Queries the database for the user's roles and their associated permissions.
 */
export async function hasPermission(
  userId: string,
  requiredPermission: PermissionName
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  for (const ur of userRoles) {
    // Super admin has all permissions
    if (ur.role.name === SYSTEM_ROLES.SUPER_ADMIN) return true;

    for (const rp of ur.role.rolePermissions) {
      if (rp.permission.name === requiredPermission) return true;
    }
  }

  return false;
}

/**
 * Check if a user has ANY of the specified permissions.
 */
export async function hasAnyPermission(
  userId: string,
  permissions: PermissionName[]
): Promise<boolean> {
  for (const perm of permissions) {
    if (await hasPermission(userId, perm)) return true;
  }
  return false;
}

/**
 * Check if a user has ALL of the specified permissions.
 */
export async function hasAllPermissions(
  userId: string,
  permissions: PermissionName[]
): Promise<boolean> {
  for (const perm of permissions) {
    if (!(await hasPermission(userId, perm))) return false;
  }
  return true;
}

/**
 * Check if a user has a specific role.
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: { name: roleName },
    },
  });
  return !!userRole;
}

/**
 * Get all permissions for a user (flattened list).
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();

  for (const ur of userRoles) {
    // Super admin gets all permissions
    if (ur.role.name === SYSTEM_ROLES.SUPER_ADMIN) {
      return Object.values(PERMISSIONS);
    }

    for (const rp of ur.role.rolePermissions) {
      permissions.add(rp.permission.name);
    }
  }

  return Array.from(permissions);
}

// ---- Middleware Helper ----

/**
 * Require specific permission in an API route.
 * Returns a 403 response if the user lacks the permission.
 */
export function requirePermission(permission: PermissionName) {
  return async (user: TokenPayload): Promise<Response | null> => {
    const allowed = await hasPermission(user.userId, permission);
    if (!allowed) {
      return Response.json(
        { error: "Forbidden", message: "You do not have permission to perform this action." },
        { status: 403 }
      );
    }
    return null; // Permission granted
  };
}

/**
 * Require any of the specified roles in an API route.
 */
export function requireRole(...roles: string[]) {
  return async (user: TokenPayload): Promise<Response | null> => {
    for (const role of roles) {
      if (user.roles.includes(role)) return null; // Role matched
    }
    return Response.json(
      { error: "Forbidden", message: "You do not have the required role." },
      { status: 403 }
    );
  };
}
