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

export function readOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as StoredOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: StoredOrder) {
  const existing = readOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
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

export function getOrder(orderNumber: string) {
  return readOrders().find((o) => o.orderNumber === orderNumber);
}

export function createOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BMC-${ymd}-${rand}`;
}
