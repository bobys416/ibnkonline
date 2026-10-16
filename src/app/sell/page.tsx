import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, Truck, ChevronRight, CheckCircle2 } from "lucide-react";
import { SellerOnboardingForm } from "@/components/sell/SellerOnboardingForm";

export const metadata = {
  title: "Sell on iBNK | Merchant Onboarding & Marketplace Growth",
  description: "Grow your retail and brand business with iBNK. Reach millions of Indian shoppers with simple onboarding, pan-India logistics, and fast settlements.",
};

export default function SellOnIbnkPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Sell on iBNK</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#172033] to-[#1554D1] p-8 sm:p-12 text-white space-y-4 shadow-md">
          <span className="inline-block rounded-full bg-[#FF7900] px-3.5 py-1 text-xs font-black tracking-wide uppercase text-white">
            iBNK Seller Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Grow your business with iBNK across India
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            &quot;Discover More. Shop Better.&quot; Connect your retail store or brand directly with pan-India consumers through our fulfillment infrastructure and secure payment network.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="#onboard-form"
              className="rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white px-6 py-3 text-sm font-bold transition-all shadow-sm"
            >
              Register as Seller
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-sm font-bold transition-all backdrop-blur-sm"
            >
              Contact Seller Desk
            </Link>
          </div>
        </div>

        {/* Why Sell With iBNK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Pan-India Reach</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase your products to customers in metro and non-metro pin codes without managing your own e-commerce app.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Integrated Logistics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Doorstep pickup from your store or warehouse with automated shipping labels and live AWB tracking.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Fast Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct bank settlements within 7 days of successful order delivery with transparent GST reporting.
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-[#172033]">What you need to start selling:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid GSTIN and PAN Number</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Active Business Current Account</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Commercial Pickup Address in India</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Genuine, branded or authentic products</span>
            </div>
          </div>
        </div>

        {/* Onboarding form */}
        <div id="onboard-form" className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#172033]">Express Seller Registration</h2>
          <p className="text-xs text-slate-500">
            Submit your business details below. Our merchant partner team will review your application within 2 business days.
          </p>

          <SellerOnboardingForm />
        </div>
      </div>
    </div>
  );
}

