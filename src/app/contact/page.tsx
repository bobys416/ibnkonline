import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | iBNK Marketplace",
  description: "Get in touch with the iBNK customer support team. We're here to help with your orders, payments, and shopping inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Contact Customer Support</h1>
          <p className="text-sm text-slate-600">
            Have questions about your order, delivery, or returns? We&apos;re here to assist you.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#172033]">Email Support</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              For general inquiries, order issues, or feedback, drop us an email anytime.
            </p>
            <a
              href="mailto:contact@ibnk.online"
              className="inline-block text-sm font-bold text-[#1554D1] hover:underline"
            >
              contact@ibnk.online
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#172033]">Support Hours</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our support team operates 7 days a week to ensure smooth deliveries across India.
            </p>
            <p className="text-sm font-semibold text-[#172033]">
              Monday – Sunday: 9:00 AM – 8:00 PM IST
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#172033]">Corporate Office</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              iBNK Fulfillment & Operations Hub:
            </p>
            <address className="not-italic text-sm text-[#172033] font-medium leading-snug">
              Wadala, Mumbai, Maharashtra 400031, India
            </address>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#172033]">Quick Self-Service</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Check real-time status of your orders or browse our comprehensive Help Center.
            </p>
            <div className="flex gap-3 text-sm font-bold">
              <Link href="/orders" className="text-[#1554D1] hover:underline">Track Orders</Link>
              <span className="text-slate-300">·</span>
              <Link href="/help" className="text-[#1554D1] hover:underline">Help FAQs</Link>
            </div>
          </div>
        </div>

        {/* Message form container */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#172033]">Send us a message</h2>
          <p className="text-xs text-slate-500">
            Fill in the details below and our customer assistance desk will get back to you within 24 hours.
          </p>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

