import { NextRequest } from "next/server";
import { requireOperations } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;

  const applications = marketplaceStore.getMerchantApplications({ status });
  return apiSuccess({ applications, total: applications.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const {
    businessName,
    legalName,
    contactPerson,
    email,
    phone,
    businessAddress,
    city,
    district,
    state,
    pinCode,
    businessCategory,
    gstNumber,
    panNumber,
    bankAccountNumber,
    bankIfsc,
    bankName,
    bankBeneficiaryName,
    storeDetails,
    requestedCategories = [],
    documents = [],
    operationalNotes,
  } = body;

  if (!businessName || !contactPerson || !email || !phone || !businessAddress || !city || !state || !pinCode || !businessCategory) {
    return apiError("Missing required merchant intake fields (business name, contact person, email, phone, address, city, state, pin, category).", 400);
  }

  // Basic PIN code check
  if (!/^\d{6}$/.test(pinCode.trim())) {
    return apiError("Please provide a valid 6-digit Indian PIN code.", 400);
  }

  const app = marketplaceStore.createMerchantApplication(
    {
      businessName,
      legalName,
      contactPerson,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      businessAddress,
      city,
      district,
      state,
      pinCode: pinCode.trim(),
      businessCategory,
      gstNumber: gstNumber?.trim() || undefined,
      panNumber: panNumber?.trim() || undefined,
      bankAccountNumber: bankAccountNumber ? `••••••••${bankAccountNumber.slice(-4)}` : undefined,
      bankIfsc: bankIfsc?.trim() || undefined,
      bankName: bankName?.trim() || undefined,
      bankBeneficiaryName: bankBeneficiaryName?.trim() || undefined,
      storeDetails,
      requestedCategories,
      documents,
      operationalNotes,
      submittedBy: auth.user.email,
    },
    { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] }
  );

  return apiSuccess({
    message: "Merchant onboarding application successfully submitted for Master Admin review.",
    application: app,
  }, 201);
}

