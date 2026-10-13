import Link from "next/link";
import { RotateCcw, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Returns & Refunds Policy | iBNK Marketplace",
  description: "Understand the return window, return process, eligibility criteria, and refund timelines for products purchased on iBNK.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Returns & Refunds</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Returns & Refunds Policy</h1>
          <p className="text-sm text-slate-600">
            Hassle-free 7-day return policy for eligible products across iBNK.online.
          </p>
        </div>

        {/* 3 Step Return Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1554D1] font-black text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Request Return</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Go to My Account → Orders within 7 days of delivery and select &quot;Return / Exchange&quot;.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1554D1] font-black text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Doorstep Pickup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our courier executive will inspect the product and pick it up from your delivery address.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1554D1] font-black text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Prompt Refund</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once verified at our hub, the refund is initiated to your original payment method or bank account.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">1. Return Eligibility Window</h2>
            <p>
              Most items purchased on iBNK are eligible for return or replacement within <strong>7 calendar days</strong> of receiving delivery, provided the item is in unused, original condition with all brand tags, manuals, and manufacturer packaging intact.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">2. Category-Specific Guidelines</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-[#172033] font-bold">
                  <tr className="border-b border-slate-200">
                    <th className="p-3">Category</th>
                    <th className="p-3">Return Window</th>
                    <th className="p-3">Policy & Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Electronics & Appliances</td>
                    <td className="p-3">7 Days</td>
                    <td className="p-3">Replacement only in case of technical defect or transit damage. Brand service center policy applies for warranty.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Clothing & Fashion</td>
                    <td className="p-3">7 Days</td>
                    <td className="p-3">Refund or exchange allowed. Must be unworn with original tags and packaging intact.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Grocery & Perishables</td>
                    <td className="p-3">24 Hours</td>
                    <td className="p-3">Eligible for refund only if received damaged, expired, or incorrect. Perishables cannot be returned once delivered.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Personal Care & Hygiene</td>
                    <td className="p-3">Non-returnable</td>
                    <td className="p-3">For hygiene reasons, opened beauty, grooming, and intimate items cannot be returned.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">3. Refund Timelines</h2>
            <p>
              Once a returned item is received and inspected at our Wadala hub, refunds are processed according to the original payment instrument:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Online Card / Net Banking (via Stripe):</strong> 5–7 business days to reflect in your card statement.
              </li>
              <li>
                <strong>UPI Payments:</strong> 24–48 business hours directly to the paying VPA/bank account.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> Initiated via NEFT/IMPS bank transfer to your nominated bank account within 3–5 business days after pickup verification.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">4. How to Initiate a Return</h2>
            <p>
              1. Log into your account and navigate to <Link href="/orders" className="text-[#1554D1] font-semibold hover:underline">My Orders</Link>.<br />
              2. Select the specific order and item you want to return.<br />
              3. Upload a photo if the product arrived damaged or defective.<br />
              4. Confirm your pickup address and select a convenient pickup date.
            </p>
          </section>
        </div>

        {/* Help Banner */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-[#1554D1] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Need guidance on an exchange or refund?</h3>
              <p className="text-xs text-slate-500">Contact our customer care desk at contact@ibnk.online.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="rounded-xl bg-[#1554D1] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#0E44B0] transition-colors shrink-0"
          >
            Contact Help Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

