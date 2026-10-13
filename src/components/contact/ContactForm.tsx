"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-emerald-950">Message Sent Successfully!</h3>
        <p className="text-xs text-emerald-800">
          Thank you for reaching out. Our customer assistance desk at Wadala, Mumbai will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Kumar"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Order Number (Optional)</label>
        <input
          type="text"
          placeholder="e.g. BMC-20261013-XXXXXX"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
        <textarea
          rows={4}
          required
          placeholder="Describe your question or issue in detail..."
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20 transition-all resize-y"
        ></textarea>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-[#1554D1] hover:bg-[#0E44B0] text-white px-6 py-3 text-sm font-bold transition-all shadow-sm active:scale-98"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
