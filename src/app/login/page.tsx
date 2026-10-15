"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signInWithOAuth } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { AlertCircle, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";
  const prefilledEmail = searchParams.get("email") || "";

  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [notFoundEmail, setNotFoundEmail] = useState("");
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
    const errors: { email?: string; password?: string } = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");
    setNotFoundEmail("");

    if (!validate()) {
      return;
    }

    setBusy(true);
    const res = await login(email, password);
    setBusy(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      const errMsg = res.error || "Invalid email or password.";
      setGeneralError(errMsg);

      if (errMsg.toLowerCase().includes("not found") || errMsg.toLowerCase().includes("no account")) {
        setNotFoundEmail(email.trim());
      }
    }
  }

  async function handleGoogleSignIn() {
    setOauthBusy(true);
    setGeneralError("");
    try {
      const res = await signInWithOAuth("google");
      if (!res.success && res.error) {
        setGeneralError(res.error);
      }
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : "Google sign in error");
    } finally {
      setOauthBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 space-y-5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[#172033]">Sign in</h1>
          <p className="text-sm text-slate-600 mt-1">
            Access your iBNK orders, wishlist, and user-specific savings.
          </p>
        </div>

        {/* Global Error Alert Banner */}
        {generalError && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                  Sign in failed
                </p>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {generalError}
                </p>
              </div>
            </div>

            {/* Quick redirect helper if account is not registered */}
            {notFoundEmail && (
              <div className="pt-2 border-t border-rose-200/60">
                <Link
                  href={`/register?email=${encodeURIComponent(notFoundEmail)}&redirect=${encodeURIComponent(redirectPath)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1554D1] hover:underline"
                >
                  <span>Create a new account with this email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Google OAuth Button */}
        {hasSupabase && (
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              {oauthBusy ? "Connecting to Google…" : "Continue with Google"}
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

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email address <span className="text-rose-500">*</span>
            </label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                fieldErrors.email
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password input field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <Link
                href="/help"
                className="text-[11px] text-[#1554D1] font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm outline-none transition-all ${
                  fieldErrors.password
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-black shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{busy ? "Verifying credentials…" : "Sign in to account"}</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${redirectPath !== "/account" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
              className="text-[#1554D1] font-bold hover:underline"
            >
              Register here
            </Link>
          </span>
          <Link href="/help" className="text-slate-400 hover:text-slate-600">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-sm text-slate-500">
          Loading sign in…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
