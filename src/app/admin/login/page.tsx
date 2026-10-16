"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Layers, KeyRound } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If redirect param has forbidden, display message
    if (searchParams.get("error") === "forbidden") {
      setErrorMessage("Access denied: You need Operations Operator clearance to enter this portal.");
    }
  }, [searchParams]);

  function fillDemoCredentials() {
    setEmail("operations@ibnk.online");
    setPassword("OpsOperator@2026");
    setErrorMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both operator email and password.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/portal-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Invalid operator credentials.");
        setBusy(false);
        return;
      }

      // Check role clearance for operations portal
      const roles: string[] = data.data?.user?.roles || [];
      const hasClearance = roles.some((r) =>
        [
          "product_operations",
          "merchant_operations",
          "master_admin",
          "super_admin",
          "finance_ops",
        ].includes(r)
      );

      if (!hasClearance) {
        setErrorMessage("Access denied: Your account lacks Operations Operator privileges.");
        setBusy(false);
        return;
      }

      // Save user info to localStorage for sidebar
      localStorage.setItem("ibnk.portal.user", JSON.stringify(data.data.user));
      localStorage.setItem("ibnk.portal.token", data.data.accessToken);

      router.replace(redirectPath);
    } catch {
      setErrorMessage("Network error during operator login. Please verify connectivity.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo/ibnk-logo.png"
              alt="iBNK Marketplace"
              width={140}
              height={44}
              className="h-10 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1554D1] text-xs font-bold rounded-full border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Product & Merchant Operations Portal</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Operator Access Control
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorized access only for catalogue managers, warehouse operators, and merchant onboarding staff.
          </p>
        </div>

        {/* Main Login Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operations@ibnk.online"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full bg-[#1554D1] hover:bg-[#0E44B0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{busy ? "Verifying clearance…" : "Authenticate & Enter Portal"}</span>
            </button>
          </form>

          {/* Demo Helper Badge */}
          <div className="pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Default Operator Credentials</span>
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-bold text-[#1554D1] hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 rounded-lg p-2 leading-relaxed">
                Email: <span className="font-semibold text-slate-900">operations@ibnk.online</span>
                <br />
                Password: <span className="font-semibold text-slate-900">OpsOperator@2026</span>
              </p>
            </div>
          </div>

          {/* Links to Master Admin and Storefront */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/master-admin/login"
              className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Master Admin Login</span>
            </Link>
            <Link href="/" className="hover:text-slate-800 hover:underline">
              ← Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-sm text-slate-500">
          Loading operations authentication…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

