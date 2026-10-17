// ============================================
// iBNK MARKETPLACE — AUTHORITATIVE DATA STORE
// Centralized marketplace state engine powering:
// - Customer Website & Storefront
// - Future iOS & Android Applications
// - Product & Merchant Operations Portal (/admin)
// - Master Admin Control Center (/master-admin)
// ============================================

function getFs() {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("fs");
    } catch {
      return null;
    }
  }
  return null;
}

function getPath() {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("path");
    } catch {
      return null;
    }
  }
  return null;
}

export type MarketplaceProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "UNLISTING_REQUESTED"
  | "UNLISTED"
  | "REJECTED"
  | "ARCHIVED";

export type TaxCategoryType = "GST_0" | "GST_5" | "GST_12" | "GST_18" | "GST_28";

export interface MarketplaceProductVariant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  mrpPaise?: number;
  sellingPricePaise?: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  categorySlug: string;
  categoryName: string;
  brand: string;
  merchantId?: string;
  merchantName?: string;
  mrpPaise: number;
  sellingPricePaise: number;
  costPricePaise?: number;
  taxCategory: TaxCategoryType;
  hsnCode?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  images: string[];
  specs: { key: string; value: string }[];
  variants: MarketplaceProductVariant[];
  status: MarketplaceProductStatus;
  rejectionReason?: string;
  unlistingReason?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isCodEligible: boolean;
  freeShipping: boolean;
  returnWindowDays: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publishedBy?: string;
}

export type MerchantAppStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "DOCUMENTS_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface MerchantApplication {
  id: string;
  applicationNumber: string;
  businessName: string;
  legalName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  businessCategory: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBeneficiaryName?: string;
  storeDetails?: string;
  requestedCategories: string[];
  documents: { type: string; url: string; name: string }[];
  status: MerchantAppStatus;
  operationalNotes?: string;
  reviewComments?: string;
  rejectionReason?: string;
  submittedBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type MerchantStatus = "ACTIVE" | "UNDER_REVIEW" | "SUSPENDED" | "REJECTED";

export interface Merchant {
  id: string;
  businessName: string;
  legalName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  businessCategory: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBeneficiaryName?: string;
  commissionRatePercent: number;
  status: MerchantStatus;
  distributorId?: string;
  distributorName?: string;
  areaDistributorId?: string;
  areaDistributorName?: string;
  totalProducts: number;
  gmvPaise: number;
  rating: number;
  notes?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Distributor {
  id: string;
  distributorCode: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  registeredAddress: string;
  state: string;
  district?: string;
  pinCode: string;
  operationalTerritory: string;
  territoryPinCodes: string[];
  commissionRatePercent: number;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  assignedAreaDistributorCount: number;
  assignedMerchantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AreaDistributor {
  id: string;
  code: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  district?: string;
  pinCode: string;
  territoryPinCodes: string[];
  distributorId: string;
  distributorName: string;
  commissionRatePercent: number;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  assignedMerchantCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalRequestType =
  | "PRODUCT_CREATION"
  | "PRODUCT_UPDATE"
  | "PRODUCT_UNLIST"
  | "MERCHANT_ONBOARDING"
  | "MERCHANT_STATUS_CHANGE"
  | "DISTRIBUTOR_ONBOARDING"
  | "REFUND_DUAL_CONTROL"
  | "ROLE_GRANT";

export type ApprovalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  type: ApprovalRequestType;
  status: ApprovalRequestStatus;
  entityType: "Product" | "MerchantApplication" | "Merchant" | "Distributor" | "Refund" | "User";
  entityId: string;
  title: string;
  proposedData: Record<string, any>;
  previousData?: Record<string, any>;
  submittedBy: string;
  submittedByName: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  decisionReason?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: "products" | "merchants" | "distributors" | "approvals" | "orders" | "financials" | "users" | "settings";
  targetEntity: string;
  targetId: string;
  details?: Record<string, any>;
  reason?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  merchantId?: string;
  merchantName?: string;
  provider: "STRIPE" | "RAZORPAY" | "CASHFREE" | "COD";
  providerTxnId: string;
  amountPaise: number;
  currency: string;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "COD";
  status: "INITIATED" | "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED" | "DISPUTED";
  refundAmountPaise?: number;
  commissionPaise: number;
  netPayoutPaise: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementRecord {
  id: string;
  settlementNumber: string;
  merchantId?: string;
  merchantName?: string;
  distributorId?: string;
  distributorName?: string;
  periodStart: string;
  periodEnd: string;
  grossSalesPaise: number;
  commissionPaise: number;
  refundsDeductedPaise: number;
  netPayoutPaise: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "ON_HOLD";
  bankRefNumber?: string;
  processedBy?: string;
  processedAt?: string;
  notes?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// IN-MEMORY / PERSISTENT SINGLETON STATE
// -------------------------------------------------------------

class MarketplaceState {
  products: MarketplaceProduct[] = [];
  merchantApplications: MerchantApplication[] = [];
  merchants: Merchant[] = [];
  distributors: Distributor[] = [];
  areaDistributors: AreaDistributor[] = [];
  approvalRequests: ApprovalRequest[] = [];
  auditLogs: AuditLogEntry[] = [];
  transactions: FinancialTransaction[] = [];
  settlements: SettlementRecord[] = [];
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    passwordHash: string;
    roles: string[];
    status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
    createdAt: string;
    updatedAt: string;
  }> = [];
  orders: Array<{
    orderNumber: string;
    userId: string;
    userEmail: string;
    createdAt: string;
    status: "PLACED" | "CONFIRMED" | "FAILED" | "CANCELLED" | "DELIVERED";
    paymentMethod: "ONLINE" | "COD";
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    paymentMethodDetail?: string;
    address: any;
    items: any[];
    subtotalPaise: number;
    shippingPaise: number;
    taxPaise: number;
    totalPaise: number;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
  }> = [];

  constructor() {
    this.seedInitialData();
    this.loadFromDisk();
  }

  private getStoragePath(): string | null {
    const p = getPath();
    if (!p) return null;
    try {
      return p.join(process.cwd(), "data", "marketplace-data.json");
    } catch {
      return null;
    }
  }

  loadFromDisk() {
    const fs = getFs();
    const filePath = this.getStoragePath();
    if (!fs || !filePath) return;

    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed) {
          if (Array.isArray(parsed.users) && parsed.users.length > 0) {
            const existingEmails = new Set(this.users.map((u) => u.email.toLowerCase()));
            for (const u of parsed.users) {
              if (!existingEmails.has(u.email.toLowerCase())) {
                this.users.push(u);
                existingEmails.add(u.email.toLowerCase());
              }
            }
          }
          if (Array.isArray(parsed.orders) && parsed.orders.length > 0) {
            const existingOrderNums = new Set(this.orders.map((o) => o.orderNumber));
            for (const o of parsed.orders) {
              if (!existingOrderNums.has(o.orderNumber)) {
                this.orders.push(o);
                existingOrderNums.add(o.orderNumber);
              }
            }
          }
          if (Array.isArray(parsed.products) && parsed.products.length > 0) {
            const existingIds = new Set(this.products.map((p) => p.id));
            for (const p of parsed.products) {
              if (!existingIds.has(p.id)) {
                this.products.push(p);
                existingIds.add(p.id);
              }
            }
          }
          if (Array.isArray(parsed.merchants) && parsed.merchants.length > 0) {
            const existingIds = new Set(this.merchants.map((m) => m.id));
            for (const m of parsed.merchants) {
              if (!existingIds.has(m.id)) {
                this.merchants.push(m);
                existingIds.add(m.id);
              }
            }
          }
          if (Array.isArray(parsed.merchantApplications) && parsed.merchantApplications.length > 0) {
            const existingIds = new Set(this.merchantApplications.map((a) => a.id));
            for (const a of parsed.merchantApplications) {
              if (!existingIds.has(a.id)) {
                this.merchantApplications.push(a);
                existingIds.add(a.id);
              }
            }
          }
          if (Array.isArray(parsed.approvalRequests) && parsed.approvalRequests.length > 0) {
            const existingIds = new Set(this.approvalRequests.map((r) => r.id));
            for (const r of parsed.approvalRequests) {
              if (!existingIds.has(r.id)) {
                this.approvalRequests.push(r);
                existingIds.add(r.id);
              }
            }
          }
          if (Array.isArray(parsed.auditLogs) && parsed.auditLogs.length > 0) {
            const existingIds = new Set(this.auditLogs.map((l) => l.id));
            for (const l of parsed.auditLogs) {
              if (!existingIds.has(l.id)) {
                this.auditLogs.push(l);
                existingIds.add(l.id);
              }
            }
          }
          if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
            const existingIds = new Set(this.transactions.map((t) => t.id));
            for (const t of parsed.transactions) {
              if (!existingIds.has(t.id)) {
                this.transactions.push(t);
                existingIds.add(t.id);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("MarketplaceStore loadFromDisk warning:", e);
    }
  }

  saveToDisk() {
    const fs = getFs();
    const filePath = this.getStoragePath();
    if (!fs || !filePath) return;

    try {
      const data = {
        users: this.users,
        orders: this.orders,
        products: this.products,
        merchants: this.merchants,
        merchantApplications: this.merchantApplications,
        distributors: this.distributors,
        areaDistributors: this.areaDistributors,
        approvalRequests: this.approvalRequests,
        auditLogs: this.auditLogs,
        transactions: this.transactions,
        settlements: this.settlements,
      };
      const p = getPath();
      const dir = p ? p.dirname(filePath) : null;
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.warn("MarketplaceStore saveToDisk warning:", e);
    }
  }

  private seedInitialData() {
    // 1. Initial Distributors
    this.distributors = [
      {
        id: "dist-001",
        distributorCode: "DIST-MH-01",
        businessName: "Sahyadri Logistics & Distribution LLP",
        contactPerson: "Rajesh Kulkarni",
        email: "rajesh.kulkarni@sahyadrilogistics.in",
        phone: "+91 98200 11223",
        registeredAddress: "Sector 19, Vashi, Navi Mumbai",
        state: "Maharashtra",
        district: "Thane",
        pinCode: "400703",
        operationalTerritory: "Mumbai Metropolitan Region & Konkan",
        territoryPinCodes: ["400001", "400031", "400050", "400703", "400705"],
        commissionRatePercent: 2.5,
        status: "ACTIVE",
        assignedAreaDistributorCount: 2,
        assignedMerchantCount: 14,
        createdAt: "2026-09-01T10:00:00Z",
        updatedAt: "2026-09-01T10:00:00Z",
      },
      {
        id: "dist-002",
        distributorCode: "DIST-DL-01",
        businessName: "Northern Apex Trade Hub",
        contactPerson: "Vikram Malhotra",
        email: "v.malhotra@northernapex.com",
        phone: "+91 98110 33445",
        registeredAddress: "Okhla Industrial Area Phase III, New Delhi",
        state: "Delhi",
        district: "South Delhi",
        pinCode: "110020",
        operationalTerritory: "Delhi NCR, Gurugram & Noida",
        territoryPinCodes: ["110001", "110020", "122001", "201301"],
        commissionRatePercent: 2.5,
        status: "ACTIVE",
        assignedAreaDistributorCount: 1,
        assignedMerchantCount: 8,
        createdAt: "2026-09-05T11:00:00Z",
        updatedAt: "2026-09-05T11:00:00Z",
      },
    ];

    // 2. Initial Area Distributors
    this.areaDistributors = [
      {
        id: "adist-001",
        code: "ADIST-MUM-CENTRAL",
        businessName: "Central Mumbai Apex Delivery Network",
        contactPerson: "Anand Shetye",
        email: "anand.shetye@apexnetwork.in",
        phone: "+91 98205 77889",
        address: "Wadala Truck Terminal, Mumbai",
        state: "Maharashtra",
        district: "Mumbai City",
        pinCode: "400031",
        territoryPinCodes: ["400031", "400014", "400015", "400019"],
        distributorId: "dist-001",
        distributorName: "Sahyadri Logistics & Distribution LLP",
        commissionRatePercent: 1.5,
        status: "ACTIVE",
        assignedMerchantCount: 9,
        createdAt: "2026-09-10T12:00:00Z",
        updatedAt: "2026-09-10T12:00:00Z",
      },
      {
        id: "adist-002",
        code: "ADIST-THANE-ZONE",
        businessName: "Thane Belt Quick Commerce Depot",
        contactPerson: "Sunil Patil",
        email: "sunil.patil@thanebelt.in",
        phone: "+91 98334 66778",
        address: "Ghodbunder Road, Thane West",
        state: "Maharashtra",
        district: "Thane",
        pinCode: "400607",
        territoryPinCodes: ["400601", "400602", "400607"],
        distributorId: "dist-001",
        distributorName: "Sahyadri Logistics & Distribution LLP",
        commissionRatePercent: 1.5,
        status: "ACTIVE",
        assignedMerchantCount: 5,
        createdAt: "2026-09-12T14:00:00Z",
        updatedAt: "2026-09-12T14:00:00Z",
      },
    ];

    // 3. Initial Approved Merchants
    this.merchants = [
      {
        id: "mer-001",
        businessName: "FarmFresh Naturals Organics",
        legalName: "FarmFresh Naturals Agro India Pvt Ltd",
        contactPerson: "Dhananjay Deshmukh",
        email: "dhananjay@farmfreshagro.in",
        phone: "+91 98211 44556",
        businessAddress: "Gala 4, APMC Market 1, Vashi",
        city: "Navi Mumbai",
        district: "Thane",
        state: "Maharashtra",
        pinCode: "400703",
        businessCategory: "Grocery & Essentials",
        gstNumber: "27AAACF1234F1Z8",
        panNumber: "AAACF1234F",
        bankAccountNumber: "••••••••4821",
        bankIfsc: "HDFC0000123",
        bankName: "HDFC Bank",
        bankBeneficiaryName: "FarmFresh Naturals Agro India Pvt Ltd",
        commissionRatePercent: 6.0,
        status: "ACTIVE",
        distributorId: "dist-001",
        distributorName: "Sahyadri Logistics & Distribution LLP",
        areaDistributorId: "adist-001",
        areaDistributorName: "Central Mumbai Apex Delivery Network",
        totalProducts: 18,
        gmvPaise: 48500000,
        rating: 4.8,
        createdAt: "2026-09-15T09:00:00Z",
        updatedAt: "2026-09-15T09:00:00Z",
        approvedAt: "2026-09-15T10:30:00Z",
        approvedBy: "Master Admin (system)",
      },
      {
        id: "mer-002",
        businessName: "Aura Sound & Gadgets",
        legalName: "Aura Electronics Retailers LLP",
        contactPerson: "Kavita Verma",
        email: "kavita@auragadgets.com",
        phone: "+91 98199 88776",
        businessAddress: "Shop 12, Lamington Road, Grant Road East",
        city: "Mumbai",
        district: "Mumbai City",
        state: "Maharashtra",
        pinCode: "400007",
        businessCategory: "Electronics & Tech",
        gstNumber: "27AABCA9876Q1ZM",
        panNumber: "AABCA9876Q",
        bankAccountNumber: "••••••••1904",
        bankIfsc: "ICIC0000456",
        bankName: "ICICI Bank",
        bankBeneficiaryName: "Aura Electronics Retailers LLP",
        commissionRatePercent: 8.5,
        status: "ACTIVE",
        distributorId: "dist-001",
        distributorName: "Sahyadri Logistics & Distribution LLP",
        areaDistributorId: "adist-001",
        areaDistributorName: "Central Mumbai Apex Delivery Network",
        totalProducts: 24,
        gmvPaise: 92300000,
        rating: 4.7,
        createdAt: "2026-09-18T11:00:00Z",
        updatedAt: "2026-09-18T11:00:00Z",
        approvedAt: "2026-09-18T14:15:00Z",
        approvedBy: "Master Admin (system)",
      },
    ];

    // 4. Initial Merchant Onboarding Applications (Intake Queue)
    this.merchantApplications = [
      {
        id: "app-001",
        applicationNumber: "APP-202610-001",
        businessName: "Heritage Handlooms & Textiles",
        legalName: "Heritage Artisans Private Limited",
        contactPerson: "Meenakshi Sundaram",
        email: "meenakshi@heritagehandlooms.in",
        phone: "+91 98450 12345",
        businessAddress: "No. 45, Commercial Street",
        city: "Bengaluru",
        district: "Bengaluru Urban",
        state: "Karnataka",
        pinCode: "560001",
        businessCategory: "Fashion & Apparel",
        gstNumber: "29AABCH5544K1ZZ",
        panNumber: "AABCH5544K",
        bankAccountNumber: "••••••••5512",
        bankIfsc: "SBIN0001234",
        bankName: "State Bank of India",
        bankBeneficiaryName: "Heritage Artisans Private Limited",
        storeDetails: "Producer of authentic handloom silk sarees, khadi apparel, and craft accessories directly supporting 120 artisan families.",
        requestedCategories: ["fashion", "home"],
        documents: [
          { type: "GST_CERTIFICATE", url: "/documents/gst-heritage.pdf", name: "gst-registration-cert.pdf" },
          { type: "PAN_CARD", url: "/documents/pan-heritage.pdf", name: "company-pan.pdf" },
          { type: "CANCELLED_CHEQUE", url: "/documents/cheque-heritage.pdf", name: "cancelled-cheque.pdf" },
        ],
        status: "SUBMITTED",
        operationalNotes: "Operator checked contact number, verified active GST number on portal. Ready for Master Admin approval.",
        submittedBy: "operations@ibnk.online",
        createdAt: "2026-10-12T16:30:00Z",
        updatedAt: "2026-10-12T16:30:00Z",
      },
      {
        id: "app-002",
        applicationNumber: "APP-202610-002",
        businessName: "Indus Roasters Artisan Coffee",
        legalName: "Indus Roasters LLP",
        contactPerson: "Arjun Nambiar",
        email: "arjun@indusroasters.coffee",
        phone: "+91 97412 88990",
        businessAddress: "Plot 88, Industrial Suburb, Yeshwantpur",
        city: "Bengaluru",
        district: "Bengaluru Urban",
        state: "Karnataka",
        pinCode: "560022",
        businessCategory: "Grocery & Essentials",
        gstNumber: "29AAACI3322P1Z0",
        panNumber: "AAACI3322P",
        bankAccountNumber: "••••••••9981",
        bankIfsc: "KKBK0000789",
        bankName: "Kotak Mahindra Bank",
        bankBeneficiaryName: "Indus Roasters LLP",
        storeDetails: "Single-origin shade-grown specialty coffee beans, roasted fresh and packed with one-way degassing valves.",
        requestedCategories: ["grocery"],
        documents: [
          { type: "GST_CERTIFICATE", url: "/documents/gst-indus.pdf", name: "gst_certificate.pdf" },
          { type: "FSSAI_LICENSE", url: "/documents/fssai-indus.pdf", name: "fssai_central_license.pdf" },
        ],
        status: "UNDER_REVIEW",
        operationalNotes: "FSSAI license verified. Master Admin reviewing commercial terms.",
        submittedBy: "operations@ibnk.online",
        createdAt: "2026-10-13T09:15:00Z",
        updatedAt: "2026-10-13T09:15:00Z",
      },
    ];

    // 5. Initial Products with Authoritative States
    this.products = [
      {
        id: "prod-grocery-1",
        name: "Daawat Rozana Gold Basmati Rice (5kg)",
        slug: "daawat-rozana-gold-basmati-rice-5kg",
        sku: "IBNK-GR-001",
        description: "Aged long-grain basmati rice with exceptional aroma, fluffy texture, and consistent grain elongation for everyday biryanis and pulao.",
        shortDescription: "Aged long-grain basmati rice with authentic aroma and premium grain separation.",
        categorySlug: "grocery",
        categoryName: "Grocery & Essentials",
        brand: "Daawat",
        merchantId: "mer-001",
        merchantName: "FarmFresh Naturals Organics",
        mrpPaise: 54900,
        sellingPricePaise: 42900,
        costPricePaise: 36000,
        taxCategory: "GST_0",
        hsnCode: "10063020",
        stockQuantity: 180,
        lowStockThreshold: 20,
        images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80"],
        specs: [
          { key: "Net Weight", value: "5 kg" },
          { key: "Grain Type", value: "Long Grain Basmati" },
          { key: "Aging", value: "2 Years Aged" },
        ],
        variants: [
          { id: "var-gr-1-5kg", sku: "IBNK-GR-001-5KG", name: "5 kg Bag", stockQuantity: 180, sellingPricePaise: 42900, mrpPaise: 54900 },
        ],
        status: "PUBLISHED",
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isCodEligible: true,
        freeShipping: true,
        returnWindowDays: 7,
        createdBy: "operations@ibnk.online",
        createdAt: "2026-09-20T10:00:00Z",
        updatedAt: "2026-09-20T10:00:00Z",
        publishedAt: "2026-09-20T12:00:00Z",
        publishedBy: "masteradmin@ibnk.online",
      },
      {
        id: "prod-elec-1",
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        slug: "sony-wh-1000xm5-wireless-headphones",
        sku: "IBNK-EL-002",
        description: "Industry-leading noise cancellation powered by two processors and eight microphones. Ultra-comfortable lightweight design and 30-hour battery life with quick charge.",
        shortDescription: "Flagship active noise cancelling over-ear headphones with 30-hour battery life.",
        categorySlug: "electronics",
        categoryName: "Electronics & Tech",
        brand: "Sony",
        merchantId: "mer-002",
        merchantName: "Aura Sound & Gadgets",
        mrpPaise: 3499000,
        sellingPricePaise: 2899000,
        costPricePaise: 2500000,
        taxCategory: "GST_18",
        hsnCode: "85183000",
        stockQuantity: 34,
        lowStockThreshold: 5,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
        specs: [
          { key: "Battery Life", value: "Up to 30 Hours" },
          { key: "Noise Cancellation", value: "Dual Processor ANC" },
          { key: "Connectivity", value: "Bluetooth 5.2 / Multipoint" },
        ],
        variants: [
          { id: "var-el-1-blk", sku: "IBNK-EL-002-BLK", name: "Silver Black", color: "Black", stockQuantity: 22, sellingPricePaise: 2899000, mrpPaise: 3499000 },
          { id: "var-el-1-slv", sku: "IBNK-EL-002-SLV", name: "Platinum Silver", color: "Silver", stockQuantity: 12, sellingPricePaise: 2899000, mrpPaise: 3499000 },
        ],
        status: "PUBLISHED",
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isCodEligible: false,
        freeShipping: true,
        returnWindowDays: 7,
        createdBy: "operations@ibnk.online",
        createdAt: "2026-09-22T10:00:00Z",
        updatedAt: "2026-09-22T10:00:00Z",
        publishedAt: "2026-09-22T14:30:00Z",
        publishedBy: "masteradmin@ibnk.online",
      },
      {
        id: "prod-pending-1",
        name: "Pure Cold Pressed Mustard Oil (Kachi Ghani) 2L",
        slug: "pure-cold-pressed-mustard-oil-2l",
        sku: "IBNK-GR-003",
        description: "100% natural cold-pressed virgin mustard oil with high pungency and omega-3 richness. Retains natural antioxidants.",
        shortDescription: "100% pure cold pressed kachi ghani mustard oil for authentic Indian cooking.",
        categorySlug: "grocery",
        categoryName: "Grocery & Essentials",
        brand: "FarmFresh Naturals",
        merchantId: "mer-001",
        merchantName: "FarmFresh Naturals Organics",
        mrpPaise: 49900,
        sellingPricePaise: 38900,
        costPricePaise: 31000,
        taxCategory: "GST_5",
        hsnCode: "15149110",
        stockQuantity: 75,
        lowStockThreshold: 10,
        images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80"],
        specs: [
          { key: "Volume", value: "2 Litres" },
          { key: "Method", value: "Wood Cold-Pressed (Kachi Ghani)" },
        ],
        variants: [
          { id: "var-gr-3-2l", sku: "IBNK-GR-003-2L", name: "2 Litre Bottle", stockQuantity: 75, sellingPricePaise: 38900, mrpPaise: 49900 },
        ],
        status: "PENDING_REVIEW",
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        isCodEligible: true,
        freeShipping: false,
        returnWindowDays: 5,
        createdBy: "operations@ibnk.online",
        createdAt: "2026-10-13T14:00:00Z",
        updatedAt: "2026-10-13T14:00:00Z",
      },
      {
        id: "prod-draft-1",
        name: "Bose QuietComfort Ultra Earbuds",
        slug: "bose-quietcomfort-ultra-earbuds",
        sku: "IBNK-EL-004",
        description: "Spatial audio earbuds with custom tune technology and world-class quiet mode.",
        shortDescription: "High-fidelity spatial audio earbuds with active noise cancellation.",
        categorySlug: "electronics",
        categoryName: "Electronics & Tech",
        brand: "Bose",
        merchantId: "mer-002",
        merchantName: "Aura Sound & Gadgets",
        mrpPaise: 2990000,
        sellingPricePaise: 2590000,
        costPricePaise: 2200000,
        taxCategory: "GST_18",
        hsnCode: "85183000",
        stockQuantity: 15,
        lowStockThreshold: 3,
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"],
        specs: [{ key: "Water Resistance", value: "IPX4" }],
        variants: [
          { id: "var-el-4-blk", sku: "IBNK-EL-004-BLK", name: "Black", stockQuantity: 15, sellingPricePaise: 2590000, mrpPaise: 2990000 },
        ],
        status: "DRAFT",
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isCodEligible: false,
        freeShipping: true,
        returnWindowDays: 7,
        createdBy: "operations@ibnk.online",
        createdAt: "2026-10-13T18:00:00Z",
        updatedAt: "2026-10-13T18:00:00Z",
      },
    ];

    // 6. Centralized Approval Requests Queue
    this.approvalRequests = [
      {
        id: "req-001",
        requestNumber: "AR-202610-001",
        type: "PRODUCT_CREATION",
        status: "PENDING",
        entityType: "Product",
        entityId: "prod-pending-1",
        title: "New Product Listing: Pure Cold Pressed Mustard Oil 2L",
        proposedData: {
          name: "Pure Cold Pressed Mustard Oil (Kachi Ghani) 2L",
          sku: "IBNK-GR-003",
          sellingPricePaise: 38900,
          mrpPaise: 49900,
          categorySlug: "grocery",
          stockQuantity: 75,
          merchantId: "mer-001",
        },
        submittedBy: "operations@ibnk.online",
        submittedByName: "Catalogue Operator (Operations)",
        createdAt: "2026-10-13T14:05:00Z",
        updatedAt: "2026-10-13T14:05:00Z",
      },
      {
        id: "req-002",
        requestNumber: "AR-202610-002",
        type: "MERCHANT_ONBOARDING",
        status: "PENDING",
        entityType: "MerchantApplication",
        entityId: "app-001",
        title: "Merchant Onboarding Approval: Heritage Handlooms & Textiles",
        proposedData: {
          businessName: "Heritage Handlooms & Textiles",
          email: "meenakshi@heritagehandlooms.in",
          phone: "+91 98450 12345",
          gstNumber: "29AABCH5544K1ZZ",
          panNumber: "AABCH5544K",
          commissionRatePercent: 7.0,
        },
        submittedBy: "operations@ibnk.online",
        submittedByName: "Merchant Ops Intake Operator",
        createdAt: "2026-10-12T16:35:00Z",
        updatedAt: "2026-10-12T16:35:00Z",
      },
    ];

    // 7. Initial Immutable Audit Logs
    this.auditLogs = [
      {
        id: "audit-001",
        actorId: "masteradmin@ibnk.online",
        actorName: "Master Admin System",
        actorRole: "MASTER_ADMIN",
        action: "merchant.approved",
        module: "merchants",
        targetEntity: "Merchant",
        targetId: "mer-001",
        details: { merchantName: "FarmFresh Naturals Organics", commissionRate: 6.0 },
        reason: "KYC documents and active GST verified with Wadala hub linkage.",
        createdAt: "2026-09-15T10:30:00Z",
      },
      {
        id: "audit-002",
        actorId: "masteradmin@ibnk.online",
        actorName: "Master Admin System",
        actorRole: "MASTER_ADMIN",
        action: "product.published",
        module: "products",
        targetEntity: "Product",
        targetId: "prod-grocery-1",
        details: { sku: "IBNK-GR-001", price: "₹429" },
        reason: "Initial catalog verification passed.",
        createdAt: "2026-09-20T12:00:00Z",
      },
      {
        id: "audit-003",
        actorId: "operations@ibnk.online",
        actorName: "Catalogue Operator",
        actorRole: "PRODUCT_OPERATIONS",
        action: "product.submit_for_approval",
        module: "approvals",
        targetEntity: "Product",
        targetId: "prod-pending-1",
        details: { sku: "IBNK-GR-003", proposedPricePaise: 38900 },
        reason: "New autumn cooking oil catalog line proposed.",
        createdAt: "2026-10-13T14:05:00Z",
      },
    ];

    // 8. Financial Transactions Ledger
    this.transactions = [
      {
        id: "txn-1001",
        orderId: "ord-8801",
        orderNumber: "BMC-20261012-78912",
        merchantId: "mer-001",
        merchantName: "FarmFresh Naturals Organics",
        provider: "STRIPE",
        providerTxnId: "pi_3NqV124XyzAbc01",
        amountPaise: 42900,
        currency: "INR",
        paymentMethod: "UPI",
        status: "CAPTURED",
        commissionPaise: 2574, // 6%
        netPayoutPaise: 40326,
        createdAt: "2026-10-12T14:22:00Z",
        updatedAt: "2026-10-12T14:23:00Z",
      },
      {
        id: "txn-1002",
        orderId: "ord-8802",
        orderNumber: "BMC-20261013-11029",
        merchantId: "mer-002",
        merchantName: "Aura Sound & Gadgets",
        provider: "STRIPE",
        providerTxnId: "pi_3NqW998KlmnOp02",
        amountPaise: 2899000,
        currency: "INR",
        paymentMethod: "CARD",
        status: "CAPTURED",
        commissionPaise: 246415, // 8.5%
        netPayoutPaise: 2652585,
        createdAt: "2026-10-13T11:10:00Z",
        updatedAt: "2026-10-13T11:11:00Z",
      },
    ];

    // 9. Initial Settlement Statements
    this.settlements = [
      {
        id: "stl-001",
        settlementNumber: "STL-202610-001",
        merchantId: "mer-001",
        merchantName: "FarmFresh Naturals Organics",
        periodStart: "2026-10-01T00:00:00Z",
        periodEnd: "2026-10-07T23:59:59Z",
        grossSalesPaise: 4200000,
        commissionPaise: 252000,
        refundsDeductedPaise: 0,
        netPayoutPaise: 3948000,
        status: "COMPLETED",
        bankRefNumber: "UTR998877112233",
        processedBy: "masteradmin@ibnk.online",
        processedAt: "2026-10-08T15:00:00Z",
        notes: "Weekly cycle payout executed via automated NEFT.",
        createdAt: "2026-10-08T14:30:00Z",
      },
    ];
  }

  // -----------------------------------------------------------
  // AUDIT LOG HELPER
  // -----------------------------------------------------------
  logAudit(entry: Omit<AuditLogEntry, "id" | "createdAt">): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newEntry);
    return newEntry;
  }

  // -----------------------------------------------------------
  // PRODUCT OPERATIONS
  // -----------------------------------------------------------
  getProducts(filter?: { status?: MarketplaceProductStatus; categorySlug?: string; query?: string }): MarketplaceProduct[] {
    let result = [...this.products];
    if (filter?.status) {
      result = result.filter((p) => p.status === filter.status);
    }
    if (filter?.categorySlug) {
      result = result.filter((p) => p.categorySlug === filter.categorySlug);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.sku, p.brand, p.categoryName].join(" ").toLowerCase().includes(q)
      );
    }
    return result;
  }

  getPublishedStoreProducts(): MarketplaceProduct[] {
    return this.products.filter((p) => p.status === "PUBLISHED");
  }

  getProductById(id: string): MarketplaceProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductBySku(sku: string): MarketplaceProduct | undefined {
    return this.products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  }

  createProduct(data: Omit<MarketplaceProduct, "id" | "createdAt" | "updatedAt">, actor: { id: string; name: string; role: string }): MarketplaceProduct {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const product: MarketplaceProduct = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.products.unshift(product);

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: data.status === "DRAFT" ? "product.draft_created" : "product.created",
      module: "products",
      targetEntity: "Product",
      targetId: id,
      details: { sku: product.sku, name: product.name, status: product.status },
    });

    return product;
  }

  updateProduct(id: string, updates: Partial<MarketplaceProduct>, actor: { id: string; name: string; role: string }, reason?: string): MarketplaceProduct {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found.`);

    const previous = { ...this.products[index] };
    const updated: MarketplaceProduct = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.products[index] = updated;

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "product.updated",
      module: "products",
      targetEntity: "Product",
      targetId: id,
      details: { previous: { status: previous.status, price: previous.sellingPricePaise }, updated: { status: updated.status, price: updated.sellingPricePaise } },
      reason,
    });

    return updated;
  }

  // Operator submits product for review -> adds to approval queue
  submitProductForApproval(id: string, actor: { id: string; name: string; role: string }, comments?: string): ApprovalRequest {
    const product = this.getProductById(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    product.status = "PENDING_REVIEW";
    product.updatedAt = new Date().toISOString();

    const reqNumber = `AR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const approvalReq: ApprovalRequest = {
      id: `req-${Date.now()}`,
      requestNumber: reqNumber,
      type: "PRODUCT_CREATION",
      status: "PENDING",
      entityType: "Product",
      entityId: id,
      title: `Publication Request: ${product.name} (${product.sku})`,
      proposedData: {
        name: product.name,
        sku: product.sku,
        mrpPaise: product.mrpPaise,
        sellingPricePaise: product.sellingPricePaise,
        stockQuantity: product.stockQuantity,
        categorySlug: product.categorySlug,
      },
      submittedBy: actor.id,
      submittedByName: actor.name,
      comments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.approvalRequests.unshift(approvalReq);

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "product.submitted_for_approval",
      module: "approvals",
      targetEntity: "Product",
      targetId: id,
      details: { requestNumber: reqNumber, sku: product.sku },
      reason: comments,
    });

    return approvalReq;
  }

  // Operator requests unlisting -> adds to approval queue
  requestProductUnlisting(id: string, actor: { id: string; name: string; role: string }, reason: string): ApprovalRequest {
    const product = this.getProductById(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    product.status = "UNLISTING_REQUESTED";
    product.unlistingReason = reason;
    product.updatedAt = new Date().toISOString();

    const reqNumber = `AR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const approvalReq: ApprovalRequest = {
      id: `req-${Date.now()}`,
      requestNumber: reqNumber,
      type: "PRODUCT_UNLIST",
      status: "PENDING",
      entityType: "Product",
      entityId: id,
      title: `Unlist Request: ${product.name} (${product.sku})`,
      proposedData: {
        unlistingReason: reason,
        sku: product.sku,
      },
      previousData: {
        status: "PUBLISHED",
      },
      submittedBy: actor.id,
      submittedByName: actor.name,
      decisionReason: reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.approvalRequests.unshift(approvalReq);

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "product.unlisting_requested",
      module: "approvals",
      targetEntity: "Product",
      targetId: id,
      details: { sku: product.sku },
      reason,
    });

    return approvalReq;
  }

  // -----------------------------------------------------------
  // MERCHANT ONBOARDING & MANAGEMENT
  // -----------------------------------------------------------
  getMerchantApplications(filter?: { status?: MerchantAppStatus }): MerchantApplication[] {
    if (filter?.status) {
      return this.merchantApplications.filter((a) => a.status === filter.status);
    }
    return this.merchantApplications;
  }

  getMerchantApplicationById(id: string): MerchantApplication | undefined {
    return this.merchantApplications.find((a) => a.id === id);
  }

  // Operations Portal initiates onboarding intake (Intake only!)
  createMerchantApplication(
    data: Omit<MerchantApplication, "id" | "applicationNumber" | "status" | "createdAt" | "updatedAt">,
    actor: { id: string; name: string; role: string }
  ): MerchantApplication {
    const id = `app-${Date.now()}`;
    const appNumber = `APP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const app: MerchantApplication = {
      ...data,
      id,
      applicationNumber: appNumber,
      status: "SUBMITTED",
      createdAt: now,
      updatedAt: now,
    };

    this.merchantApplications.unshift(app);

    // Also push to centralized Master Admin approval queue
    const reqNumber = `AR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.approvalRequests.unshift({
      id: `req-${Date.now()}`,
      requestNumber: reqNumber,
      type: "MERCHANT_ONBOARDING",
      status: "PENDING",
      entityType: "MerchantApplication",
      entityId: id,
      title: `Merchant Onboarding Application: ${app.businessName}`,
      proposedData: {
        businessName: app.businessName,
        legalName: app.legalName,
        email: app.email,
        phone: app.phone,
        gstNumber: app.gstNumber,
        panNumber: app.panNumber,
        city: app.city,
        state: app.state,
        pinCode: app.pinCode,
      },
      submittedBy: actor.id,
      submittedByName: actor.name,
      createdAt: now,
      updatedAt: now,
    });

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "merchant_application.submitted",
      module: "merchants",
      targetEntity: "MerchantApplication",
      targetId: id,
      details: { applicationNumber: appNumber, businessName: app.businessName },
    });

    return app;
  }

  getMerchants(filter?: { status?: MerchantStatus; search?: string }): Merchant[] {
    let result = [...this.merchants];
    if (filter?.status) {
      result = result.filter((m) => m.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((m) =>
        [m.businessName, m.contactPerson, m.email, m.phone, m.city].join(" ").toLowerCase().includes(q)
      );
    }
    return result;
  }

  getMerchantById(id: string): Merchant | undefined {
    return this.merchants.find((m) => m.id === id);
  }

  // Idempotent merchant approval by Master Admin
  approveMerchantApplication(
    appId: string,
    actor: { id: string; name: string; role: string },
    commissionRatePercent: number = 5.0,
    distributorId?: string,
    areaDistributorId?: string
  ): Merchant {
    // Separation of duties: Operator cannot approve their own application
    const app = this.getMerchantApplicationById(appId);
    if (!app) throw new Error(`Application ${appId} not found.`);

    if (app.submittedBy === actor.id) {
      throw new Error("Separation of duties violation: An operator cannot approve their own onboarding application.");
    }

    // Check if merchant account already created for this email or phone (Idempotency)
    const existing = this.merchants.find((m) => m.email.toLowerCase() === app.email.toLowerCase());
    if (existing) {
      app.status = "APPROVED";
      app.reviewedBy = actor.id;
      app.reviewedAt = new Date().toISOString();
      return existing;
    }

    const now = new Date().toISOString();
    app.status = "APPROVED";
    app.reviewedBy = actor.id;
    app.reviewedAt = now;

    const distributor = distributorId ? this.distributors.find((d) => d.id === distributorId) : undefined;
    const areaDistributor = areaDistributorId ? this.areaDistributors.find((ad) => ad.id === areaDistributorId) : undefined;

    const newMerchant: Merchant = {
      id: `mer-${Date.now()}`,
      businessName: app.businessName,
      legalName: app.legalName,
      contactPerson: app.contactPerson,
      email: app.email,
      phone: app.phone,
      businessAddress: app.businessAddress,
      city: app.city,
      district: app.district,
      state: app.state,
      pinCode: app.pinCode,
      businessCategory: app.businessCategory,
      gstNumber: app.gstNumber,
      panNumber: app.panNumber,
      bankAccountNumber: app.bankAccountNumber,
      bankIfsc: app.bankIfsc,
      bankName: app.bankName,
      bankBeneficiaryName: app.bankBeneficiaryName,
      commissionRatePercent,
      status: "ACTIVE",
      distributorId,
      distributorName: distributor?.businessName,
      areaDistributorId,
      areaDistributorName: areaDistributor?.businessName,
      totalProducts: 0,
      gmvPaise: 0,
      rating: 5.0,
      approvedAt: now,
      approvedBy: actor.name,
      createdAt: now,
      updatedAt: now,
    };

    this.merchants.unshift(newMerchant);

    // Update related approval request if present
    const req = this.approvalRequests.find((r) => r.entityId === appId && r.status === "PENDING");
    if (req) {
      req.status = "APPROVED";
      req.reviewedBy = actor.id;
      req.reviewedByName = actor.name;
      req.reviewedAt = now;
    }

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "merchant.approved",
      module: "merchants",
      targetEntity: "Merchant",
      targetId: newMerchant.id,
      details: { businessName: newMerchant.businessName, commissionRatePercent },
      reason: "Master Admin approved onboarding application.",
    });

    return newMerchant;
  }

  // Reject merchant application
  rejectMerchantApplication(appId: string, actor: { id: string; name: string; role: string }, reason: string): MerchantApplication {
    const app = this.getMerchantApplicationById(appId);
    if (!app) throw new Error(`Application ${appId} not found.`);

    if (app.submittedBy === actor.id) {
      throw new Error("Separation of duties violation: An operator cannot decide their own onboarding application.");
    }

    app.status = "REJECTED";
    app.rejectionReason = reason;
    app.reviewedBy = actor.id;
    app.reviewedAt = new Date().toISOString();

    const req = this.approvalRequests.find((r) => r.entityId === appId && r.status === "PENDING");
    if (req) {
      req.status = "REJECTED";
      req.reviewedBy = actor.id;
      req.reviewedByName = actor.name;
      req.decisionReason = reason;
      req.reviewedAt = new Date().toISOString();
    }

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "merchant_application.rejected",
      module: "merchants",
      targetEntity: "MerchantApplication",
      targetId: appId,
      reason,
    });

    return app;
  }

  // Suspend/Reactivate Merchant
  setMerchantStatus(merchantId: string, status: MerchantStatus, actor: { id: string; name: string; role: string }, reason?: string): Merchant {
    const merchant = this.getMerchantById(merchantId);
    if (!merchant) throw new Error(`Merchant ${merchantId} not found.`);

    const prevStatus = merchant.status;
    merchant.status = status;
    merchant.updatedAt = new Date().toISOString();

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: status === "SUSPENDED" ? "merchant.suspended" : "merchant.status_changed",
      module: "merchants",
      targetEntity: "Merchant",
      targetId: merchantId,
      details: { from: prevStatus, to: status },
      reason,
    });

    return merchant;
  }

  // -----------------------------------------------------------
  // DISTRIBUTOR & AREA DISTRIBUTOR MANAGEMENT
  // -----------------------------------------------------------
  getDistributors(): Distributor[] {
    return this.distributors;
  }

  getAreaDistributors(): AreaDistributor[] {
    return this.areaDistributors;
  }

  createDistributor(data: Omit<Distributor, "id" | "assignedAreaDistributorCount" | "assignedMerchantCount" | "createdAt" | "updatedAt">, actor: { id: string; name: string; role: string }): Distributor {
    // Ensure code & email uniqueness
    if (this.distributors.some((d) => d.distributorCode === data.distributorCode)) {
      throw new Error(`Distributor code ${data.distributorCode} already in use.`);
    }

    const id = `dist-${Date.now()}`;
    const now = new Date().toISOString();
    const dist: Distributor = {
      ...data,
      id,
      assignedAreaDistributorCount: 0,
      assignedMerchantCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.distributors.push(dist);

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "distributor.created",
      module: "distributors",
      targetEntity: "Distributor",
      targetId: id,
      details: { code: dist.distributorCode, name: dist.businessName },
    });

    return dist;
  }

  createAreaDistributor(
    data: Omit<AreaDistributor, "id" | "distributorName" | "assignedMerchantCount" | "createdAt" | "updatedAt">,
    actor: { id: string; name: string; role: string }
  ): AreaDistributor {
    const parentDist = this.distributors.find((d) => d.id === data.distributorId);
    if (!parentDist) throw new Error(`Parent Distributor ${data.distributorId} not found.`);

    if (this.areaDistributors.some((ad) => ad.code === data.code)) {
      throw new Error(`Area distributor code ${data.code} already in use.`);
    }

    const id = `adist-${Date.now()}`;
    const now = new Date().toISOString();
    const areaDist: AreaDistributor = {
      ...data,
      id,
      distributorName: parentDist.businessName,
      assignedMerchantCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.areaDistributors.push(areaDist);
    parentDist.assignedAreaDistributorCount += 1;

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: "area_distributor.created",
      module: "distributors",
      targetEntity: "AreaDistributor",
      targetId: id,
      details: { code: areaDist.code, parentDistributor: parentDist.businessName },
    });

    return areaDist;
  }

  // -----------------------------------------------------------
  // CENTRALIZED APPROVAL WORKFLOWS
  // -----------------------------------------------------------
  getApprovalRequests(filter?: { status?: ApprovalRequestStatus; type?: ApprovalRequestType }): ApprovalRequest[] {
    let result = [...this.approvalRequests];
    if (filter?.status) {
      result = result.filter((r) => r.status === filter.status);
    }
    if (filter?.type) {
      result = result.filter((r) => r.type === filter.type);
    }
    return result;
  }

  decideApprovalRequest(
    requestId: string,
    decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES",
    actor: { id: string; name: string; role: string },
    reason?: string
  ): ApprovalRequest {
    const req = this.approvalRequests.find((r) => r.id === requestId);
    if (!req) throw new Error(`Approval request ${requestId} not found.`);

    // Separation of duties rule
    if (req.submittedBy === actor.id) {
      throw new Error("Separation of duties violation: You cannot approve or decide your own request.");
    }

    const now = new Date().toISOString();
    req.status = decision === "APPROVE" ? "APPROVED" : decision === "REJECT" ? "REJECTED" : "CHANGES_REQUESTED";
    req.reviewedBy = actor.id;
    req.reviewedByName = actor.name;
    req.reviewedAt = now;
    req.decisionReason = reason;

    // Apply side effects
    if (req.type === "PRODUCT_CREATION" || req.type === "PRODUCT_UPDATE") {
      const product = this.getProductById(req.entityId);
      if (product) {
        if (decision === "APPROVE") {
          product.status = "PUBLISHED";
          product.publishedAt = now;
          product.publishedBy = actor.name;
        } else if (decision === "REJECT") {
          product.status = "REJECTED";
          product.rejectionReason = reason;
        } else {
          product.status = "CHANGES_REQUESTED";
          product.rejectionReason = reason;
        }
        product.updatedAt = now;
      }
    } else if (req.type === "PRODUCT_UNLIST") {
      const product = this.getProductById(req.entityId);
      if (product) {
        if (decision === "APPROVE") {
          product.status = "UNLISTED";
        } else {
          product.status = "PUBLISHED";
        }
        product.updatedAt = now;
      }
    } else if (req.type === "MERCHANT_ONBOARDING") {
      if (decision === "APPROVE") {
        this.approveMerchantApplication(req.entityId, actor);
      } else if (decision === "REJECT") {
        this.rejectMerchantApplication(req.entityId, actor, reason || "Application rejected by Master Admin.");
      }
    }

    this.logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: `approval.${decision.toLowerCase()}`,
      module: "approvals",
      targetEntity: req.entityType,
      targetId: req.entityId,
      details: { requestNumber: req.requestNumber, decision },
      reason,
    });

    return req;
  }

  // -----------------------------------------------------------
  // FINANCIAL LEDGER & DASHBOARD AGGREGATES
  // -----------------------------------------------------------
  getFinancialLedger(): FinancialTransaction[] {
    return this.transactions;
  }

  getSettlements(): SettlementRecord[] {
    return this.settlements;
  }

  getAuditLogs(filter?: { module?: string; query?: string }): AuditLogEntry[] {
    let result = [...this.auditLogs];
    if (filter?.module) {
      result = result.filter((a) => a.module === filter.module);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter((a) =>
        [a.action, a.actorName, a.targetEntity, a.reason || ""].join(" ").toLowerCase().includes(q)
      );
    }
    return result;
  }

  // Master Admin Overview Aggregates (calculated from real entities, no fake charts!)
  getMasterAdminDashboardMetrics() {
    const totalOrders = this.transactions.length;
    const paidTransactions = this.transactions.filter((t) => t.status === "CAPTURED");
    const grossOrderValuePaise = paidTransactions.reduce((acc, t) => acc + t.amountPaise, 0);
    const totalCommissionsPaise = paidTransactions.reduce((acc, t) => acc + t.commissionPaise, 0);
    const failedTransactions = this.transactions.filter((t) => t.status === "FAILED").length;
    const refunds = this.transactions.filter((t) => t.status === "REFUNDED");
    const totalRefundsPaise = refunds.reduce((acc, t) => acc + (t.refundAmountPaise || 0), 0);

    const activeMerchants = this.merchants.filter((m) => m.status === "ACTIVE").length;
    const pendingMerchantApplications = this.merchantApplications.filter(
      (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW"
    ).length;
    const pendingProductApprovals = this.approvalRequests.filter(
      (r) => r.status === "PENDING" && (r.type === "PRODUCT_CREATION" || r.type === "PRODUCT_UPDATE" || r.type === "PRODUCT_UNLIST")
    ).length;

    return {
      grossOrderValuePaise,
      netCollectionsPaise: grossOrderValuePaise - totalRefundsPaise,
      totalOrders,
      paidOrderCount: paidTransactions.length,
      failedTransactionCount: failedTransactions,
      totalCommissionsPaise,
      totalRefundsPaise,
      merchantCount: this.merchants.length,
      activeMerchantCount: activeMerchants,
      pendingMerchantApplications,
      distributorCount: this.distributors.length,
      areaDistributorCount: this.areaDistributors.length,
      totalProductsCount: this.products.length,
      publishedProductsCount: this.products.filter((p) => p.status === "PUBLISHED").length,
      pendingProductApprovals,
      pendingSettlementsCount: this.settlements.filter((s) => s.status === "PENDING").length,
      recentAuditEvents: this.auditLogs.slice(0, 8),
    };
  }

  // Product Operations Dashboard Aggregates
  getOperationsDashboardMetrics(operatorId?: string) {
    const published = this.products.filter((p) => p.status === "PUBLISHED").length;
    const drafts = this.products.filter((p) => p.status === "DRAFT").length;
    const pendingReview = this.products.filter((p) => p.status === "PENDING_REVIEW").length;
    const unlisted = this.products.filter((p) => p.status === "UNLISTED" || p.status === "UNLISTING_REQUESTED").length;
    const lowStock = this.products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length;
    const outOfStock = this.products.filter((p) => p.stockQuantity === 0).length;

    const submittedApplications = this.merchantApplications.length;
    const awaitingMasterReview = this.merchantApplications.filter((a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW").length;

    const operatorLogs = operatorId
      ? this.auditLogs.filter((l) => l.actorId === operatorId).slice(0, 10)
      : this.auditLogs.slice(0, 10);

    return {
      totalProducts: this.products.length,
      published,
      drafts,
      pendingReview,
      unlisted,
      lowStock,
      outOfStock,
      submittedApplications,
      awaitingMasterReview,
      recentActivity: operatorLogs,
    };
  }

  // User Management
  findUserByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized);
  }

  findUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: {
    email: string;
    fullName: string;
    phone?: string;
    passwordHash: string;
    roles?: string[];
    status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
  }) {
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser = {
      id,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
      phone: data.phone?.trim(),
      passwordHash: data.passwordHash,
      roles: data.roles || ["customer"],
      status: data.status || "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  // Order Management (User-specific)
  saveOrder(orderData: any) {
    const existingIndex = this.orders.findIndex((o) => o.orderNumber === orderData.orderNumber);
    const orderRecord = {
      ...orderData,
      updatedAt: new Date().toISOString(),
    };
    let result;
    if (existingIndex >= 0) {
      this.orders[existingIndex] = { ...this.orders[existingIndex], ...orderRecord };
      result = this.orders[existingIndex];
    } else {
      this.orders.unshift(orderRecord);
      result = orderRecord;
    }
    this.saveToDisk();
    return result;
  }

  getUserOrders(userIdOrEmail: string) {
    const term = userIdOrEmail.trim().toLowerCase();
    return this.orders.filter(
      (o) => o.userId === userIdOrEmail || o.userEmail?.toLowerCase() === term
    );
  }

  getOrder(orderNumber: string) {
    return this.orders.find((o) => o.orderNumber === orderNumber);
  }
}

// Global Singleton to guarantee persistence across requests in Next.js Turbopack dev/serverless
const globalForMarketplace = globalThis as unknown as {
  ibnkMarketplaceStore?: MarketplaceState;
};

export const marketplaceStore =
  globalForMarketplace.ibnkMarketplaceStore ?? new MarketplaceState();

if (process.env.NODE_ENV !== "production") {
  globalForMarketplace.ibnkMarketplaceStore = marketplaceStore;
}

export default marketplaceStore;
