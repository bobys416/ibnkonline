import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | iBNK Marketplace",
  description: "Terms and conditions governing the use of iBNK.online marketplace, order placement, payments, and fulfillment.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Terms & Conditions</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Terms & Conditions of Use</h1>
          <p className="text-sm text-slate-600">
            Last updated: October 2026 · Governing all transactions and platform use on iBNK.online
          </p>
        </div>

        {/* Content sections */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">1. Introduction & Acceptance</h2>
            <p>
              These Terms & Conditions govern your access to and use of the iBNK website (<strong className="text-[#172033]">iBNK.online</strong>) and associated shopping services. By accessing or using our marketplace, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">2. Products, Pricing & GST</h2>
            <p>
              All prices displayed on iBNK are denominated in <strong>Indian Rupees (INR)</strong> and are inclusive of applicable Goods and Services Tax (GST) unless specified otherwise.
            </p>
            <p>
              While we make every effort to display accurate pricing and stock availability, typographical errors may occasionally occur. iBNK reserves the right to correct pricing errors before order fulfillment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">3. Orders & Order Confirmation</h2>
            <p>
              Placing an item in your shopping cart does not reserve inventory. Inventory is allocated upon successful order placement. Once placed, an automated order confirmation with your order number (e.g. BMC-XXXXXXXXXXXX) is generated and sent to you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">4. Payment Methods & Verification</h2>
            <p>
              Payments can be made via authorized online payment methods (Stripe Checkout) or Cash on Delivery (COD) for serviceable PIN codes. All online transactions undergo automated fraud risk assessment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">5. Delivery & Risk of Loss</h2>
            <p>
              Title and risk of loss for products pass to you upon delivery by the carrier. We take responsibility for transit damages reported promptly within 24 hours of delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">6. Returns, Refunds & Cancellations</h2>
            <p>
              Please refer to our dedicated <Link href="/returns" className="text-[#1554D1] font-semibold hover:underline">Returns & Refunds Policy</Link> for details regarding eligible product categories, replacement periods, and refund timelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">7. Governing Law & Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Mumbai, Maharashtra</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
