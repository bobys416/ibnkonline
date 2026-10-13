import Link from "next/link";

export default function IbnkPlusPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-[#002f6c] to-[#0071DC] text-white p-10">
        <p className="text-xs font-black uppercase tracking-wider text-[#FFC220]">Membership</p>
        <h1 className="text-4xl font-black mt-2">IBNK+</h1>
        <p className="text-white/85 mt-3">Free delivery from store, free shipping with no minimum, and member-only rollbacks.</p>
      </div>
      <div className="bg-white rounded-3xl border p-8 space-y-3">
        <p className="text-3xl font-black text-[#0071DC]">₹99 / month</p>
        <p className="text-sm text-slate-600">30-day free trial. Cancel anytime. Billed in INR.</p>
        <Link href="/register" className="inline-block px-6 py-3 rounded-full bg-[#FFC220] font-black text-sm">Start free trial</Link>
      </div>
    </div>
  );
}
