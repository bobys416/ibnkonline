"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signInWithOAuth } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2, Eye, EyeOff, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";
  const prefilledEmail = searchParams.get("email") || "";

  const { register, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(prefilledEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  function validate(): boolean {
    const errors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errors.fullName = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    const trimmedPhone = phone.trim();
    const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\+]/g, "").replace(/^91/, "").replace(/^0/, "");
    if (trimmedPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");
    setAlreadyExists(false);

    if (!validate()) {
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s\-\(\)\+]/g, "").replace(/^91/, "").replace(/^0/, "");
    setBusy(true);
    const res = await register(fullName, email, password, cleanPhone || undefined);
    setBusy(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      if (res.alreadyExists) {
        setAlreadyExists(true);
      }
      setGeneralError(res.error || "Could not register account. Please check your details.");
    }
  }

  async function handleGoogleSignUp() {
    setOauthBusy(true);
    setGeneralError("");
    try {
      const res = await signInWithOAuth("google");
      if (!res.success && res.error) {
        setGeneralError(res.error);
      }
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Google sign up error");
    } finally {
      setOauthBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 space-y-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[#172033]">Create account</h1>
          <p className="text-sm text-slate-600 mt-1">
            Join iBNK to enjoy personalized shopping, exclusive savings, and user-specific order tracking.
          </p>
        </div>

        {/* Account Already Exists Alert */}
        {alreadyExists && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Account Already Exists
                </p>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  An account is already registered with <span className="font-bold">{email}</span>. You can sign in directly with your password.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href={`/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectPath)}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-[#1554D1] hover:bg-[#0E44B0] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <span>Sign in with this account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* General Error Alert */}
        {generalError && !alreadyExists && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                Registration error
              </p>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">{generalError}</p>
            </div>
          </div>
        )}

        {/* Google OAuth Button */}
        {hasSupabase && (
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={oauthBusy}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {oauthBusy ? "Connecting to Google…" : "Sign up with Google"}
            </button>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold uppercase">
                Or with email
              </span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                fieldErrors.fullName
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
              }`}
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              autoComplete="name"
            />
            {fieldErrors.fullName && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email address <span className="text-rose-500">*</span>
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                fieldErrors.email || alreadyExists
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
              }`}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAlreadyExists(false);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                fieldErrors.phone
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
              }`}
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              autoComplete="tel"
            />
            {fieldErrors.phone && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.phone}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Create password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm outline-none transition-all ${
                  fieldErrors.password
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
                }`}
                placeholder="Minimum 6 characters"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm password
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                fieldErrors.confirmPassword
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
              }`}
              placeholder="Re-type password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword)
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.confirmPassword}</span>
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-black shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{busy ? "Setting up your account…" : "Create account"}</span>
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 text-center">
          Already have an account?{" "}
          <Link
            href={`/login${redirectPath !== "/account" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
            className="text-[#1554D1] font-bold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-sm text-slate-500">
          Loading registration…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
