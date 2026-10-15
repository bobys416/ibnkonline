export type CheckoutAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
};

export type PaymentMethodChoice = "ONLINE" | "COD";

export type StoredOrderItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  slug: string;
  imageUrl: string;
  quantity: number;
  unitPricePaise: number;
  mrpPaise: number;
};

export type StoredOrder = {
  orderNumber: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  status: "PLACED" | "CONFIRMED" | "FAILED";
  paymentMethod: PaymentMethodChoice;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  paymentMethodDetail?: string;
  address: CheckoutAddress;
  items: StoredOrderItem[];
  subtotalPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  gatewayOrderId?: string;
  gatewayCheckoutUrl?: string;
  gatewayPaymentId?: string;
};

const ORDERS_KEY = "buymecart.orders.v1";
const PENDING_PAYMENT_ORDER_KEY = "buymecart.pending-payment-order.v1";

/**
 * Reads orders isolated strictly to the authenticated user.
 * If user is not provided, returns empty array to prevent data leakage.
 */
export function readOrders(currentUser?: { id?: string; email?: string } | null): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const allOrders = raw ? (JSON.parse(raw) as StoredOrder[]) : [];

    // If an authenticated user is provided, filter strictly to this user
    if (currentUser && (currentUser.id || currentUser.email)) {
      const targetId = currentUser.id?.trim();
      const targetEmail = currentUser.email?.trim().toLowerCase();
      return allOrders.filter((o) => {
        if (targetId && o.userId === targetId) return true;
        if (targetEmail && o.userEmail?.toLowerCase() === targetEmail) return true;
        return false;
      });
    }

    // Unauthenticated visitors do not see orders belonging to registered accounts
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves order with explicit user binding.
 */
export function saveOrder(
  order: StoredOrder,
  currentUser?: { id?: string; email?: string } | null
) {
  if (typeof window === "undefined") return;

  const orderToSave: StoredOrder = {
    ...order,
    userId: order.userId || currentUser?.id,
    userEmail: order.userEmail || currentUser?.email,
  };

  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const existing: StoredOrder[] = raw ? JSON.parse(raw) : [];
    const deduped = existing.filter((o) => o.orderNumber !== orderToSave.orderNumber);
    localStorage.setItem(ORDERS_KEY, JSON.stringify([orderToSave, ...deduped]));

    // Background sync to server API
    const sessionRaw = localStorage.getItem("buymecart.session");
    const token = sessionRaw ? JSON.parse(sessionRaw)?.accessToken : null;

    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderToSave),
    }).catch(() => {
      // Offline or background network failure
    });
  } catch (error) {
    console.warn("Could not save order to storage:", error);
  }
}

export function savePendingPaymentOrder(order: StoredOrder) {
  sessionStorage.setItem(PENDING_PAYMENT_ORDER_KEY, JSON.stringify(order));
}

export function readPendingPaymentOrder(): StoredOrder | null {
  const raw = sessionStorage.getItem(PENDING_PAYMENT_ORDER_KEY);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The saved checkout details are corrupted. Contact support before retrying.");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("The saved checkout details are incomplete. Contact support before retrying.");
  }

  const order = parsed as Partial<StoredOrder>;
  if (
    typeof order.orderNumber !== "string" ||
    order.paymentMethod !== "ONLINE" ||
    order.paymentStatus !== "PENDING" ||
    typeof order.gatewayOrderId !== "string" ||
    !Number.isSafeInteger(order.totalPaise) ||
    !Array.isArray(order.items)
  ) {
    throw new Error("The saved checkout details are incomplete. Contact support before retrying.");
  }

  return order as StoredOrder;
}

export function removePendingPaymentOrder() {
  sessionStorage.removeItem(PENDING_PAYMENT_ORDER_KEY);
}

/**
 * Gets a specific order, verifying ownership if the order belongs to a user.
 */
export function getOrder(
  orderNumber: string,
  currentUser?: { id?: string; email?: string } | null
): StoredOrder | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const allOrders = raw ? (JSON.parse(raw) as StoredOrder[]) : [];
    const order = allOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) return undefined;

    // If order has an owner, verify caller ownership
    if (order.userId || order.userEmail) {
      if (!currentUser || (!currentUser.id && !currentUser.email)) {
        return undefined; // An unauthenticated visitor cannot access an authenticated user's order
      }
      const matches =
        (currentUser.id && order.userId === currentUser.id) ||
        (currentUser.email && order.userEmail?.toLowerCase() === currentUser.email.toLowerCase());
      if (!matches) {
        return undefined; // Belongs to a different user!
      }
    }

    return order;
  } catch {
    return undefined;
  }
}

export function createOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BMC-${ymd}-${rand}`;
}
