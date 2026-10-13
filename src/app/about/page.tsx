import Link from "next/link";
import { Store, ShieldCheck, Truck, Users, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";

export const metadata = {
  title: "About iBNK | Online Marketplace for India",
  description: "Learn about iBNK — everyday low prices, INR checkout, Wadala operations hub, and our mission: Ab har dukaan, bank samaan.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">About Us</span>
        </nav>

        {/* Hero Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-blue-50 text-[#1554D1] px-3 py-1 text-xs font-bold">
                Marketplace Story
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
                About iBNK
              </h1>
              <p className="text-base text-[#1554D1] font-bold">
                Ab har dukaan, bank samaan.
              </p>
            </div>
            <IbnkLogo variant="color" className="h-16 w-auto" width={180} height={108} />
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>iBNK.online</strong> is an Indian multi-category e-commerce and retail platform dedicated to offering everyday low prices, transparent INR checkout, GST-ready invoicing, and secure payment processing.
            </p>
            <p>
              Our mission is rooted in the belief that modern digital retail should be accessible to every corner of India. By connecting verified manufacturers, distributors, and local merchants through our streamlined logistics hub in Wadala, Mumbai, we bring quality essentials directly to your doorstep.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Everyday Low Prices</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated catalog across electronics, grocery, home essentials, and fashion with competitive market discounts.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Reliable Fulfillment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast dispatches powered from our central fulfillment hub in Wadala, Mumbai with real-time package tracking.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Secure Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bank-grade encrypted payments via Stripe and Cash on Delivery options across serviceable Indian PIN codes.
            </p>
          </div>
        </div>

        {/* Operations & Location Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#172033]">
            <MapPin className="w-4 h-4 text-[#1554D1]" />
            <span>Fulfillment & Corporate Office</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            iBNK Operations Hub, Wadala, Mumbai, Maharashtra 400031, India.<br />
            Official inquiries & support: <a href="mailto:contact@ibnk.online" className="text-[#1554D1] font-semibold hover:underline">contact@ibnk.online</a>
          </p>
        </div>
      </div>
    </div>
  );
}
