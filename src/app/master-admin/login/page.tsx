"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Lock, AlertCircle, Eye, EyeOff, Layers, KeyRound } from "lucide-react";

function MasterAdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/master-admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      setErrorMessage("Access denied: Level 4 Master Admin executive clearance required.");
    }
  }, [searchParams]);

  function fillDemoCredentials() {
    setEmail("masteradmin@ibnk.online");
    setPassword("MasterAdmin@2026");
    setErrorMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter executive email and password.");
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
        setErrorMessage(data.error || "Authentication failed. Invalid executive credentials.");
        setBusy(false);
        return;
      }

      // Check role clearance for Master Admin
      const roles: string[] = data.data?.user?.roles || [];
      const isMasterAdmin = roles.includes("master_admin") || roles.includes("super_admin");

      if (!isMasterAdmin) {
        setErrorMessage(
          "Forbidden: Level 4 Master Admin clearance required. Regular operators must use the Operations Portal."
        );
        setBusy(false);
        return;
      }

      // Save user info to localStorage
      localStorage.setItem("ibnk.portal.user", JSON.stringify(data.data.user));
      localStorage.setItem("ibnk.portal.token", data.data.accessToken);

      router.replace(redirectPath);
    } catch {
      setErrorMessage("Network error during Master Admin login. Please verify connectivity.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo/ibnk-logo.png"
              alt="iBNK Marketplace"
              width={140}
              height={44}
              className="h-10 w-auto mx-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Admin Control Center</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Level 4 Executive Clearance
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Governs marketplace approvals, financial ledger, settlement payouts, and RBAC permissions.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Executive Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masteradmin@ibnk.online"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Executive Security Key / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{busy ? "Verifying clearance…" : "Verify Clearance & Enter"}</span>
            </button>
          </form>

          {/* Demo Helper Badge */}
          <div className="pt-4 border-t border-slate-800">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Admin Credentials</span>
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-bold text-amber-400 hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-2 leading-relaxed">
                Email: <span className="font-semibold text-slate-200">masteradmin@ibnk.online</span>
                <br />
                Password: <span className="font-semibold text-slate-200">MasterAdmin@2026</span>
              </p>
            </div>
          </div>

          {/* Links to Operations and Storefront */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/admin/login"
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 hover:underline"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Operations Portal Login</span>
            </Link>
            <Link href="/" className="hover:text-slate-200 hover:underline">
              ← Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasterAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-sm text-slate-400">
          Loading executive authentication…
        </div>
      }
    >
      <MasterAdminLoginForm />
    </Suspense>
  );
}

