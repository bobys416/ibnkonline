import Link from "next/link";

export default function IbnkPlusPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-[#0c2f77] to-[#1554D1] text-white p-10 shadow-lg">
        <p className="text-xs font-black uppercase tracking-wider text-[#FF7900] bg-white/10 inline-block px-3 py-1 rounded-full">Membership</p>
        <h1 className="text-4xl font-black mt-3">IBNK+</h1>
        <p className="text-white/85 mt-3">Free delivery from store, free shipping with no minimum, and member-only rollbacks.</p>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-sm">
        <p className="text-3xl font-black text-[#1554D1]">₹99 / month</p>
        <p className="text-sm text-slate-600">30-day free trial. Cancel anytime. Billed in INR.</p>
        <Link href="/register" className="inline-block px-6 py-3 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-black text-sm shadow-md transition-all">Start free trial</Link>
      </div>
    </div>
  );
}
