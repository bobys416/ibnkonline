"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("customer@buymecart.com");
  const [password, setPassword] = useState("Customer@123456");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        localStorage.setItem("buymecart.session", JSON.stringify({ email, guestFallback: true }));
        router.push("/account");
        return;
      }
      localStorage.setItem("buymecart.session", JSON.stringify(json.data));
      router.push("/account");
    } catch {
      localStorage.setItem("buymecart.session", JSON.stringify({ email, guestFallback: true }));
      router.push("/account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border p-8 space-y-4">
        <h1 className="text-3xl font-black">Sign in</h1>
        <p className="text-sm text-slate-600">Use your IBNK account or continue as a demo customer.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-xl border px-4 py-2.5 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input className="w-full rounded-xl border px-4 py-2.5 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button disabled={busy} className="w-full py-3 rounded-full bg-[#0071DC] text-white font-black">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-slate-500">
          New here? <Link href="/register" className="text-[#0071DC] font-bold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
