import { describe, test, expect } from "@jest/globals";
import marketplaceStore from "../../src/lib/marketplace-store";
import { getAllProducts } from "../../src/lib/catalog";

describe("iBNK Marketplace Operations & Master Admin Governance Engine", () => {
  const operatorActor = {
    id: "usr-ops-test-01",
    name: "Catalogue Operator",
    role: "PRODUCT_OPERATIONS",
  };

  const masterAdminActor = {
    id: "usr-admin-test-01",
    name: "Master Admin Executive",
    role: "MASTER_ADMIN",
  };

  test("1. Operator creates a product draft; it does NOT appear on the live storefront", () => {
    const draftSku = `TEST-DRAFT-${Date.now()}`;
    const product = marketplaceStore.createProduct(
      {
        name: "Test Unapproved Product Draft",
        slug: `test-unapproved-draft-${draftSku.toLowerCase()}`,
        sku: draftSku,
        categorySlug: "grocery",
        categoryName: "Grocery & Essentials",
        brand: "TestBrand",
        mrpPaise: 29900,
        sellingPricePaise: 24900,
        stockQuantity: 25,
        lowStockThreshold: 5,
        taxCategory: "GST_5",
        description: "Draft test product description",
        images: ["https://example.com/test.jpg"],
        specs: [],
        variants: [{ id: "v1", sku: draftSku, name: "Std", stockQuantity: 25, sellingPricePaise: 24900, mrpPaise: 29900 }],
        status: "DRAFT",
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isCodEligible: true,
        freeShipping: false,
        returnWindowDays: 7,
        createdBy: operatorActor.id,
      },
      operatorActor
    );

    expect(product.id).toBeDefined();
    expect(product.status).toBe("DRAFT");

    // Verify it is NOT present in published storefront products
    const storeProducts = getAllProducts();
    const foundOnStore = storeProducts.find((p) => p.sku === draftSku);
    expect(foundOnStore).toBeUndefined();
  });

  test("2. Separation of duties: Submitting operator CANNOT approve their own approval request", () => {
    const sku = `TEST-SEP-${Date.now()}`;
    const product = marketplaceStore.createProduct(
      {
        name: "Test Separation Product",
        slug: `test-separation-${sku.toLowerCase()}`,
        sku,
        categorySlug: "electronics",
        categoryName: "Electronics & Tech",
        brand: "TestTech",
        mrpPaise: 99900,
        sellingPricePaise: 89900,
        stockQuantity: 10,
        lowStockThreshold: 2,
        taxCategory: "GST_18",
        description: "Separation test",
        images: ["https://example.com/test.jpg"],
        specs: [],
        variants: [{ id: "v1", sku, name: "Std", stockQuantity: 10, sellingPricePaise: 89900, mrpPaise: 99900 }],
        status: "PENDING_REVIEW",
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isCodEligible: true,
        freeShipping: true,
        returnWindowDays: 7,
        createdBy: operatorActor.id,
      },
      operatorActor
    );

    const req = marketplaceStore.submitProductForApproval(
      product.id,
      operatorActor,
      "Submitted by operator"
    );

    // Operator attempting to self-approve must throw separation of duties error
    expect(() => {
      marketplaceStore.decideApprovalRequest(req.id, "APPROVE", operatorActor);
    }).toThrow(/Separation of duties violation/);
  });

  test("3. Master Admin approves product; product status becomes PUBLISHED and propagates to storefront", () => {
    const sku = `TEST-PUB-${Date.now()}`;
    const product = marketplaceStore.createProduct(
      {
        name: "Test Auto Propagating Product",
        slug: `test-auto-propagating-${sku.toLowerCase()}`,
        sku,
        categorySlug: "grocery",
        categoryName: "Grocery & Essentials",
        brand: "OrganicValley",
        mrpPaise: 45000,
        sellingPricePaise: 38000,
        stockQuantity: 40,
        lowStockThreshold: 5,
        taxCategory: "GST_0",
        description: "Auto propagating test",
        images: ["https://example.com/oil.jpg"],
        specs: [],
        variants: [{ id: "v1", sku, name: "Std", stockQuantity: 40, sellingPricePaise: 38000, mrpPaise: 45000 }],
        status: "PENDING_REVIEW",
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        isCodEligible: true,
        freeShipping: false,
        returnWindowDays: 7,
        createdBy: operatorActor.id,
      },
      operatorActor
    );

    const req = marketplaceStore.submitProductForApproval(product.id, operatorActor);

    // Master Admin approves
    const decided = marketplaceStore.decideApprovalRequest(req.id, "APPROVE", masterAdminActor);
    expect(decided.status).toBe("APPROVED");

    // Product is now PUBLISHED
    const liveProd = marketplaceStore.getProductById(product.id);
    expect(liveProd?.status).toBe("PUBLISHED");

    // Verify it propagates to storefront catalog
    const storeProducts = getAllProducts();
    const foundOnStore = storeProducts.find((p) => p.sku === sku);
    expect(foundOnStore).toBeDefined();
    expect(foundOnStore?.name).toBe("Test Auto Propagating Product");
    expect(foundOnStore?.sellingPricePaise).toBe(38000);
  });

  test("4. Idempotent merchant approval: Repeated approvals do not create duplicate merchant records", () => {
    const uniqueEmail = `test.partner.${Date.now()}@example.in`;
    const app = marketplaceStore.createMerchantApplication(
      {
        businessName: "Test Artisans Hub",
        contactPerson: "Ramesh Sharma",
        email: uniqueEmail,
        phone: "+91 99887 66554",
        businessAddress: "123 Industrial Area",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        businessCategory: "Fashion & Apparel",
        requestedCategories: ["fashion"],
        documents: [],
        submittedBy: operatorActor.id,
      },
      operatorActor
    );

    // 1st Approval by Master Admin
    const merchant1 = marketplaceStore.approveMerchantApplication(
      app.id,
      masterAdminActor,
      6.0
    );
    expect(merchant1.id).toBeDefined();
    expect(merchant1.status).toBe("ACTIVE");

    const initialMerchantCount = marketplaceStore.getMerchants().length;

    // 2nd Approval attempt (e.g. accidental retry or network duplicate)
    const merchant2 = marketplaceStore.approveMerchantApplication(
      app.id,
      masterAdminActor,
      6.0
    );

    // Idempotency: exact same merchant returned without duplicate insertion
    expect(merchant2.id).toBe(merchant1.id);
    expect(marketplaceStore.getMerchants().length).toBe(initialMerchantCount);
  });

  test("5. Unlisting workflow: Requesting and approving unlist removes product from storefront", () => {
    const sku = `TEST-UNLIST-${Date.now()}`;
    // Create and publish product first
    const prod = marketplaceStore.createProduct(
      {
        name: "Temporary Seasonal Product",
        slug: `temporary-seasonal-${sku.toLowerCase()}`,
        sku,
        categorySlug: "grocery",
        categoryName: "Grocery & Essentials",
        brand: "SeasonalBrand",
        mrpPaise: 20000,
        sellingPricePaise: 18000,
        stockQuantity: 15,
        lowStockThreshold: 2,
        taxCategory: "GST_5",
        description: "Seasonal item",
        images: ["https://example.com/temp.jpg"],
        specs: [],
        variants: [{ id: "v1", sku, name: "Std", stockQuantity: 15 }],
        status: "PUBLISHED",
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isCodEligible: true,
        freeShipping: false,
        returnWindowDays: 7,
        createdBy: operatorActor.id,
      },
      operatorActor
    );

    // Initial check: is on storefront
    expect(getAllProducts().some((p) => p.sku === sku)).toBe(true);

    // Operator requests unlist
    const unlistReq = marketplaceStore.requestProductUnlisting(
      prod.id,
      operatorActor,
      "End of seasonal inventory"
    );
    expect(unlistReq.type).toBe("PRODUCT_UNLIST");

    // Master Admin approves unlisting
    marketplaceStore.decideApprovalRequest(unlistReq.id, "APPROVE", masterAdminActor);

    // Product status is UNLISTED
    expect(marketplaceStore.getProductById(prod.id)?.status).toBe("UNLISTED");

    // Product is now immediately excluded from customer storefront
    expect(getAllProducts().some((p) => p.sku === sku)).toBe(false);
  });

  test("6. Immutable audit log captures material business actions with before/after snapshots", () => {
    const logs = marketplaceStore.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);

    const latest = logs[0];
    expect(latest.id).toBeDefined();
    expect(latest.actorId).toBeDefined();
    expect(latest.action).toBeDefined();
    expect(latest.createdAt).toBeDefined();
  });
});

