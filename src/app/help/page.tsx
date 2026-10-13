import Link from "next/link";
import { HelpCircle, Package, CreditCard, RotateCcw, MapPin, ChevronRight, Mail } from "lucide-react";

export const metadata = {
  title: "Help Center & FAQs | iBNK Marketplace",
  description: "Find answers to frequently asked questions about orders, payments, deliveries, and returns on iBNK.",
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I track my order status?",
      answer: "You can track your order at any time by visiting My Account → Orders or clicking 'Track Order' in the header. Enter your order number (e.g., BMC-20261013-XXXXXX) for live shipment status.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support secure online payments via Stripe (Credit/Debit cards and supported digital instruments) and Cash on Delivery (COD) for eligible serviceable locations.",
    },
    {
      question: "How does delivery location detection work?",
      answer: "Click 'Detect My Location' in the header or at checkout. If your browser permits location access, we retrieve your approximate city, area, and 6-digit PIN code to pre-fill your delivery details. You can always review and edit every field manually.",
    },
    {
      question: "What is the return window for purchased items?",
      answer: "Most non-perishable products are eligible for a 7-day replacement or return from the date of delivery. Visit our Returns & Refunds page for full category-specific guidelines.",
    },
    {
      question: "How much does delivery cost?",
      answer: "Orders ₹499 and above receive free standard delivery across India. For orders under ₹499, a flat delivery fee of ₹49 is added at checkout.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Help Center</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Help Center & FAQs</h1>
          <p className="text-sm text-slate-600">
            Quick answers to common questions about shopping, shipping, and account management on iBNK.
          </p>
        </div>

        {/* Category Shortcut Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/orders"
            className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-[#1554D1] hover:shadow-sm transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554D1] mx-auto flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <span className="block text-xs font-bold text-[#172033]">Orders & Tracking</span>
          </Link>

          <Link
            href="/shipping"
            className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-[#1554D1] hover:shadow-sm transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FF7900] mx-auto flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="block text-xs font-bold text-[#172033]">Shipping Policy</span>
          </Link>

          <Link
            href="/returns"
            className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-[#1554D1] hover:shadow-sm transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] mx-auto flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <span className="block text-xs font-bold text-[#172033]">Returns & Refunds</span>
          </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-[#1554D1] hover:shadow-sm transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <span className="block text-xs font-bold text-[#172033]">Contact Support</span>
          </Link>
        </div>

        {/* FAQs Accordion/List */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#172033]">Frequently Asked Questions</h2>
          <div className="divide-y divide-slate-100 space-y-4 pt-1">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? "pt-4 space-y-1.5" : "space-y-1.5"}>
                <h3 className="text-sm font-bold text-[#172033]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Still need assistance?</h3>
            <p className="text-xs text-slate-500">Our customer team is available daily from 9:00 AM to 8:00 PM IST.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-xl bg-[#1554D1] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#0E44B0] transition-colors shrink-0"
          >
            Open Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
