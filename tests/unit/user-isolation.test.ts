import { describe, it, expect, beforeEach } from "@jest/globals";
import marketplaceStore from "@/lib/marketplace-store";
import { readOrders, saveOrder, getOrder, StoredOrder } from "@/lib/orders";

// Mock localStorage for Node environment
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
Object.defineProperty(globalThis, "window", {
  value: {
    localStorage: localStorageMock,
  },
  writable: true,
});

describe("User-Specific Order Isolation & Tenant Protection", () => {
  const userA = { id: "usr_alice_001", email: "alice@example.com" };
  const userB = { id: "usr_bob_002", email: "bob@example.com" };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it("stamps order with userId and userEmail when placed by User A", () => {
    const orderData: StoredOrder = {
      orderNumber: "BMC-2026-ALICE-1",
      createdAt: new Date().toISOString(),
      status: "PLACED",
      paymentMethod: "ONLINE",
      paymentStatus: "SUCCESS",
      address: {
        fullName: "Alice Sharma",
        phone: "9876543210",
        addressLine1: "123 Park Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
      },
      items: [
        {
          productId: "prod-1",
          variantId: "var-1",
          productName: "Organic Basmati Rice",
          variantName: "5kg Pack",
          slug: "organic-basmati-rice",
          imageUrl: "/images/rice.jpg",
          quantity: 2,
          unitPricePaise: 45000,
          mrpPaise: 55000,
        },
      ],
      subtotalPaise: 90000,
      shippingPaise: 0,
      taxPaise: 4500,
      totalPaise: 94500,
    };

    saveOrder(orderData, userA);

    // Order should exist in storage stamped with User A's credentials
    const retrieved = getOrder("BMC-2026-ALICE-1", userA);
    expect(retrieved).toBeDefined();
    expect(retrieved?.userId).toBe(userA.id);
    expect(retrieved?.userEmail).toBe(userA.email);
  });

  it("User B CANNOT see User A's orders in readOrders", () => {
    const orderAlice: StoredOrder = {
      orderNumber: "BMC-ALICE-SECRET",
      createdAt: new Date().toISOString(),
      status: "PLACED",
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      address: {
        fullName: "Alice Sharma",
        phone: "9876543210",
        addressLine1: "123 Park Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
      },
      items: [],
      subtotalPaise: 50000,
      shippingPaise: 0,
      taxPaise: 2500,
      totalPaise: 52500,
    };

    saveOrder(orderAlice, userA);

    // User A reads orders -> finds 1 order
    const aliceOrders = readOrders(userA);
    expect(aliceOrders.length).toBe(1);
    expect(aliceOrders[0].orderNumber).toBe("BMC-ALICE-SECRET");

    // User B reads orders -> finds 0 orders (COMPLETE ISOLATION)
    const bobOrders = readOrders(userB);
    expect(bobOrders.length).toBe(0);

    // Unauthenticated guest reads orders -> finds 0 orders
    const guestOrders = readOrders(null);
    expect(guestOrders.length).toBe(0);
  });

  it("User B CANNOT access User A's order details via getOrder", () => {
    const orderAlice: StoredOrder = {
      orderNumber: "BMC-CONFIDENTIAL-ORDER",
      createdAt: new Date().toISOString(),
      status: "PLACED",
      paymentMethod: "ONLINE",
      paymentStatus: "SUCCESS",
      address: {
        fullName: "Alice Sharma",
        phone: "9876543210",
        addressLine1: "123 Park Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
      },
      items: [],
      subtotalPaise: 120000,
      shippingPaise: 0,
      taxPaise: 6000,
      totalPaise: 126000,
    };

    saveOrder(orderAlice, userA);

    // User A has access
    expect(getOrder("BMC-CONFIDENTIAL-ORDER", userA)).toBeDefined();

    // User B is denied access
    expect(getOrder("BMC-CONFIDENTIAL-ORDER", userB)).toBeUndefined();

    // Unauthenticated user is denied access
    expect(getOrder("BMC-CONFIDENTIAL-ORDER", null)).toBeUndefined();
  });

  it("marketplaceStore isolates orders per userId and email", () => {
    marketplaceStore.saveOrder({
      orderNumber: "BMC-STORE-ALICE-1",
      userId: userA.id,
      userEmail: userA.email,
      totalPaise: 10000,
      items: [],
      address: {},
    });

    marketplaceStore.saveOrder({
      orderNumber: "BMC-STORE-BOB-1",
      userId: userB.id,
      userEmail: userB.email,
      totalPaise: 20000,
      items: [],
      address: {},
    });

    const aliceStoreOrders = marketplaceStore.getUserOrders(userA.id);
    expect(aliceStoreOrders.some((o) => o.orderNumber === "BMC-STORE-ALICE-1")).toBe(true);
    expect(aliceStoreOrders.some((o) => o.orderNumber === "BMC-STORE-BOB-1")).toBe(false);

    const bobStoreOrders = marketplaceStore.getUserOrders(userB.id);
    expect(bobStoreOrders.some((o) => o.orderNumber === "BMC-STORE-BOB-1")).toBe(true);
    expect(bobStoreOrders.some((o) => o.orderNumber === "BMC-STORE-ALICE-1")).toBe(false);
  });
});
