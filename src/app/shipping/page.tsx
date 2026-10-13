import Link from "next/link";
import { Truck, Clock, ShieldCheck, MapPin, ChevronRight, PackageCheck } from "lucide-react";
import { formatINR } from "@/lib/money";
import { FREE_SHIPPING_THRESHOLD_PAISE, STANDARD_SHIPPING_PAISE } from "@/lib/money";

export const metadata = {
  title: "Shipping & Delivery Policy | iBNK Marketplace",
  description: "Learn about delivery timeframes, free shipping thresholds, dispatch hubs, and tracking procedures for iBNK orders across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Shipping & Delivery</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-sm text-slate-600">
            Last updated: October 2026 · Operations Hub: Wadala, Mumbai 400031
          </p>
        </div>

        {/* Key Delivery Facts Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Free Shipping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Orders of {formatINR(FREE_SHIPPING_THRESHOLD_PAISE)} and above qualify for free standard delivery nationwide.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Transit Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Metro cities: 2–3 business days. Other serviceable PIN codes: 3–5 business days from dispatch.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Live Order Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every dispatched parcel is tracked in real-time with an assigned AWB tracking number.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">1. Delivery Coverage & Serviceable PIN Codes</h2>
            <p>
              iBNK delivers to destinations across India. Customers can enter their 6-digit postal PIN code on any product page, in the header location selector, or during checkout to verify delivery coverage.
            </p>
            <p>
              If a specific PIN code is temporarily unserviceable due to regional logistics or weather advisories, the checkout system will notify you before order confirmation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">2. Shipping Charges</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Orders {formatINR(FREE_SHIPPING_THRESHOLD_PAISE)} and above:</strong> Free standard shipping across India.
              </li>
              <li>
                <strong>Orders below {formatINR(FREE_SHIPPING_THRESHOLD_PAISE)}:</strong> Flat standard delivery fee of {formatINR(STANDARD_SHIPPING_PAISE)}.
              </li>
              <li>
                Applicable delivery charges are calculated transparently in your shopping cart before payment.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">3. Dispatch & Transit Timelines</h2>
            <p>
              Orders placed before 2:00 PM IST on business days are packed and dispatched on the same day from our primary fulfillment hub in Wadala, Mumbai. Orders placed after 2:00 PM or on Sundays and national holidays are processed on the subsequent working day.
            </p>
            <p>
              Estimated delivery windows:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Mumbai & MMR Region: 1–2 business days</li>
              <li>Tier-1 Metro Cities (Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata): 2–3 business days</li>
              <li>Rest of India: 3–5 business days</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">4. Cash on Delivery (COD)</h2>
            <p>
              Cash on Delivery is available for eligible addresses and order values. Please ensure an exact cash amount is ready at the time of delivery, or use instant UPI payment upon delivery if supported by the delivery partner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">5. Damaged or Tampered Shipments</h2>
            <p>
              If your parcel arrives with visible packaging damage or broken security seals, please refuse delivery and immediately contact our support team at <a href="mailto:contact@ibnk.online" className="text-[#1554D1] font-semibold hover:underline">contact@ibnk.online</a>.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Need help with an ongoing delivery?</h3>
            <p className="text-xs text-slate-500">Track your order or reach out to our Wadala operations desk.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/orders"
              className="rounded-xl bg-[#1554D1] text-white px-4 py-2 text-xs font-bold hover:bg-[#0E44B0] transition-colors"
            >
              Track Orders
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

