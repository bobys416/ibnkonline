"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function SellerOnboardingForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-emerald-950">Registration Received!</h3>
        <p className="text-xs text-emerald-800">
          Thank you for your interest in selling on iBNK Marketplace. Our merchant onboarding team will review your application and contact you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Business / Company Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Retail Enterprises"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Amit Verma"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
          <input
            type="email"
            required
            placeholder="vendor@company.com"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
          <input
            type="tel"
            required
            placeholder="e.g. 98765 43210"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional for initial query)</label>
          <input
            type="text"
            placeholder="e.g. 27ABCDE1234F1Z5"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Primary Product Category</label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all bg-white"
          >
            <option>Grocery & Packaged Foods</option>
            <option>Electronics & Gadgets</option>
            <option>Fashion, Apparel & Shoes</option>
            <option>Home & Kitchenware</option>
            <option>Beauty & Personal Care</option>
            <option>Other / Multi-Category</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description of Your Products</label>
        <textarea
          rows={3}
          placeholder="Tell us about the brands, inventory volume, and dispatch warehouse locations..."
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all resize-y"
        ></textarea>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-[#FF7900] hover:bg-[#e06a00] text-white px-6 py-3 text-sm font-bold transition-all shadow-md active:scale-98"
      >
        Submit Merchant Application
      </button>
    </form>
  );
}
