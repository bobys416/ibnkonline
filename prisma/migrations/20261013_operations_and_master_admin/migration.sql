-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MerchantAppStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DistributorStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApprovalRequestType" AS ENUM ('PRODUCT_CREATION', 'PRODUCT_UPDATE', 'PRODUCT_UNLIST', 'MERCHANT_ONBOARDING', 'MERCHANT_STATUS_CHANGE', 'DISTRIBUTOR_ONBOARDING', 'REFUND_DUAL_CONTROL', 'ROLE_GRANT');

-- CreateEnum
CREATE TYPE "ApprovalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('CALCULATED', 'ACCRUED', 'SETTLED', 'REVERSED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'ON_HOLD');

-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';
ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'CHANGES_REQUESTED';
ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'UNLISTING_REQUESTED';
ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'UNLISTED';

-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "merchantId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "distributors" (
    "id" TEXT NOT NULL,
    "distributorCode" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "registeredAddress" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT,
    "pinCode" TEXT NOT NULL,
    "operationalTerritory" TEXT NOT NULL,
    "territoryPinCodes" TEXT[],
    "commissionRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "status" "DistributorStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "area_distributors" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT,
    "pinCode" TEXT NOT NULL,
    "territoryPinCodes" TEXT[],
    "distributorId" TEXT NOT NULL,
    "commissionRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "status" "DistributorStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "area_distributors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "merchants" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "legalName" TEXT,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "businessCategory" TEXT,
    "bankAccountNumber" TEXT,
    "bankIfsc" TEXT,
    "bankName" TEXT,
    "bankBeneficiaryName" TEXT,
    "commissionRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "status" "MerchantStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "rejectionReason" TEXT,
    "operationalNotes" TEXT,
    "distributorId" TEXT,
    "areaDistributorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "merchant_applications" (
    "id" TEXT NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "legalName" TEXT,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "bankAccountNumber" TEXT,
    "bankIfsc" TEXT,
    "bankName" TEXT,
    "bankBeneficiaryName" TEXT,
    "storeDetails" TEXT,
    "requestedCategories" TEXT[],
    "status" "MerchantAppStatus" NOT NULL DEFAULT 'SUBMITTED',
    "operationalNotes" TEXT,
    "reviewComments" TEXT,
    "rejectionReason" TEXT,
    "submittedBy" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "merchant_documents" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT,
    "applicationId" TEXT,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "merchant_status_history" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "fromStatus" "MerchantStatus" NOT NULL,
    "toStatus" "MerchantStatus" NOT NULL,
    "reason" TEXT,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "approval_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "type" "ApprovalRequestType" NOT NULL,
    "status" "ApprovalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "proposedData" JSONB NOT NULL,
    "previousData" JSONB,
    "submittedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "decisionReason" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "product_change_requests" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "proposedData" JSONB NOT NULL,
    "previousData" JSONB,
    "changeSummary" TEXT,
    "submittedBy" TEXT NOT NULL,
    "status" "ApprovalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "decisionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "commissions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "merchantId" TEXT,
    "distributorId" TEXT,
    "areaDistributorId" TEXT,
    "orderAmountPaise" INTEGER NOT NULL,
    "commissionRatePercent" DOUBLE PRECISION NOT NULL,
    "commissionPaise" INTEGER NOT NULL,
    "netPayablePaise" INTEGER NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'CALCULATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "settlements" (
    "id" TEXT NOT NULL,
    "settlementNumber" TEXT NOT NULL,
    "merchantId" TEXT,
    "distributorId" TEXT,
    "areaDistributorId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "grossSalesPaise" INTEGER NOT NULL,
    "commissionPaise" INTEGER NOT NULL,
    "refundsDeductedPaise" INTEGER NOT NULL DEFAULT 0,
    "netPayoutPaise" INTEGER NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "bankRefNumber" TEXT,
    "processedBy" TEXT,
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "distributors_distributorCode_key" ON "distributors"("distributorCode");
CREATE UNIQUE INDEX IF NOT EXISTS "distributors_email_key" ON "distributors"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "distributors_phone_key" ON "distributors"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "area_distributors_code_key" ON "area_distributors"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "area_distributors_email_key" ON "area_distributors"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "area_distributors_phone_key" ON "area_distributors"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "merchants_email_key" ON "merchants"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "merchants_phone_key" ON "merchants"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "merchant_applications_applicationNumber_key" ON "merchant_applications"("applicationNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "approval_requests_requestNumber_key" ON "approval_requests"("requestNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "settlements_settlementNumber_key" ON "settlements"("settlementNumber");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_areaDistributorId_fkey" FOREIGN KEY ("areaDistributorId") REFERENCES "area_distributors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "area_distributors" ADD CONSTRAINT "area_distributors_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "distributors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_change_requests" ADD CONSTRAINT "product_change_requests_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
