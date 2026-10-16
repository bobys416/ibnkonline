import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSuccess } from "@/lib/api-utils";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("ibnk_portal_session");

  return apiSuccess({
    message: "Logged out from portal successfully.",
  });
}

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("ibnk_portal_session");

  return NextResponse.redirect(new URL("/admin/login", "https://ibnk.online"));
}

