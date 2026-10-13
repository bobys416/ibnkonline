import Link from "next/link";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | iBNK Marketplace",
  description: "Learn how iBNK collects, stores, protects, and processes your personal data and delivery information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Privacy & Data Protection Policy</h1>
          <p className="text-sm text-slate-600">
            Last updated: October 2026 · Applicable to users of iBNK.online in India
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Payment Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never store your card credentials. Payments are processed via PCI-DSS compliant Stripe checkout.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Data Minimization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We only collect your name, phone, and delivery address strictly necessary to fulfill your orders.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">No Data Selling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your personal information is never rented or sold to third-party advertisers or data brokers.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">1. Information We Collect</h2>
            <p>
              When you browse, register, or place an order on iBNK, we collect only the necessary information to provide our e-commerce services:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Contact Information:</strong> Your full name, mobile phone number, and email address.</li>
              <li><strong>Delivery Details:</strong> Shipping address, landmark, city, state, and postal PIN code.</li>
              <li><strong>Device & Location:</strong> If you explicitly use &quot;Detect My Location&quot;, approximate latitude/longitude is used to resolve your city/PIN code and is never stored as persistent GPS tracking logs.</li>
              <li><strong>Order History:</strong> Details of products ordered, transaction identifiers, and dispatch tracking numbers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">2. How We Use Your Information</h2>
            <p>
              We process your data strictly to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Process, pack, and deliver your orders from our Wadala fulfillment facility.</li>
              <li>Send transaction confirmation, invoice generation, and courier tracking updates.</li>
              <li>Facilitate customer support requests, replacements, and refunds.</li>
              <li>Comply with applicable Indian tax and statutory compliance obligations (GST invoicing).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">3. Third-Party Service Providers</h2>
            <p>
              We share your information solely with trusted fulfillment and technology partners:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Payment Acquirers:</strong> Stripe handles online card and digital payments over encrypted TLS connections.</li>
              <li><strong>Logistics Partners:</strong> Courier companies receive only your recipient name, address, phone number, and package contents for delivery.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">4. Grievance Officer & Contact</h2>
            <p>
              In accordance with the Information Technology Act 2000 and the Consumer Protection (E-Commerce) Rules 2020:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p><strong>Grievance Officer:</strong> Compliance Desk, iBNK</p>
              <p><strong>Address:</strong> Wadala, Mumbai, Maharashtra 400031, India</p>
              <p><strong>Email:</strong> <a href="mailto:contact@ibnk.online" className="text-[#1554D1] font-semibold hover:underline">contact@ibnk.online</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
