"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, ShieldCheck, Check, MapPin } from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";

export function Footer() {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  const footerLinksCol1 = [
    { label: "All Departments", href: "/categories" },
    { label: "Store Directory", href: "/store-directory" },
    { label: "Careers", href: "/careers" },
    { label: "Our Company", href: "/about" },
    { label: "Sell on IBNK.online", href: "/sell" },
    { label: "Help Center", href: "/help" },
    { label: "Health & Wellness", href: "/health" },
  ];

  const footerLinksCol2 = [
    { label: "Product Recalls", href: "/recalls" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Tax Exempt Program", href: "/tax-exempt" },
    { label: "Get the IBNK App", href: "/app" },
    { label: "Sign-up for Delivery", href: "/delivery-signup" },
    { label: "Safety Data Sheet", href: "/safety" },
    { label: "Terms of Use", href: "/terms" },
  ];

  const footerLinksCol3 = [
    { label: "Privacy & Security", href: "/privacy" },
    { label: "CA Privacy Rights", href: "/ca-privacy" },
    { label: "California Supply Chain Act", href: "/supply-chain" },
    { label: "Your Privacy Choices", href: "/privacy-choices" },
    { label: "Notice at Collection", href: "/notice" },
    { label: "Request My Personal Information", href: "/data-request" },
    { label: "Brand Shop Directory", href: "/brands" },
  ];

  const footerLinksCol4 = [
    { label: "Live Flight Radar", href: "/#live-flights" },
    { label: "IBNK+", href: "/ibnk-plus" },
    { label: "IBNK Business", href: "/business" },
    { label: "MoneyCenter", href: "/moneycenter" },
    { label: "IBNK Rewards Card", href: "/credit-card" },
    { label: "Weekly Ad & Deals", href: "/deals" },
  ];

  return (
    <footer className="w-full bg-[#E6F1FC] border-t border-[#cce1f8] text-[#2e2f32]">
      {/* 1. Customer Feedback Banner */}
      <div className="bg-[#E6F1FC] py-6 px-4 text-center border-b border-[#cce1f8]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-sm font-semibold text-slate-800">
            We&apos;d love to hear what you think!
          </span>
          <button
            onClick={() => setFeedbackGiven(true)}
            className="px-5 py-2 rounded-full border border-slate-800 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {feedbackGiven ? "Thank you for your feedback!" : "Give feedback"}
          </button>
        </div>
      </div>

      {/* 2. Email Newsletter Signup Strip */}
      <div className="bg-[#004f9a] text-white py-8 px-4">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold flex items-center gap-3 justify-center md:justify-start">
              <IbnkLogo variant="white" className="h-6 w-auto" width={80} height={24} />
              <span>Get email updates & everyday low price alerts</span>
            </h4>
            <p className="text-xs text-white/80 mt-1">
              Be the first to hear about seasonal rollbacks, flash deals, and new arrivals on IBNK.online.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-2.5 rounded-full text-slate-900 text-sm bg-white outline-none focus:ring-2 focus:ring-[#FFC220]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FFC220] hover:bg-[#e5ac18] text-slate-950 text-xs font-black transition-colors shrink-0 flex items-center gap-1"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" /> Joined!
                </>
              ) : (
                <>
                  Sign Up <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Multi-Column Links Directory */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-700">
          <div>
            <div className="mb-3">
              <IbnkLogo variant="color" className="h-7 w-auto mb-2" width={90} height={28} />
              <h5 className="font-bold text-slate-900 text-sm">IBNK Essentials</h5>
            </div>
            <ul className="space-y-2">
              {footerLinksCol1.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-sm mb-3">Customer Support</h5>
            <ul className="space-y-2">
              {footerLinksCol2.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-sm mb-3">Privacy & Terms</h5>
            <ul className="space-y-2">
              {footerLinksCol3.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline transition-colors flex items-center gap-1">
                    {link.label}
                    {link.label === "Your Privacy Choices" && (
                      <span className="inline-block px-1 py-0.2 bg-blue-600 text-white font-bold rounded-xs text-[9px]">
                        ✓
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-sm mb-3">Programs & Services</h5>
            <ul className="space-y-2">
              {footerLinksCol4.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Office & Corporate Address Strip */}
      <div className="bg-[#dcecfa] border-t border-[#cce1f8] py-3.5 px-4 text-xs text-slate-800">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4 text-[#0071DC] shrink-0" />
            <span className="font-bold text-slate-900">Office Address:</span>
            <span>Wadala, Mumbai, Maharashtra 400031, India</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 text-xs font-medium">
            <span>Website: <strong className="text-[#0071DC] font-bold">IBNK.online</strong></span>
            <span>·</span>
            <span>Email: <strong className="text-slate-800">contact@ibnk.online</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Legal / Copyright Strip */}
      <div className="bg-[#004f9a] text-white py-6 border-t border-[#005bb3] text-xs">
        <div className="max-w-[1536px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <IbnkLogo variant="white" className="h-5 w-auto" width={65} height={20} />
            <span className="text-white/90">
              © 2026 IBNK. All Rights Reserved. · IBNK.online
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-white/75 text-[11px]">
            <Link href="/privacy" className="hover:underline">Privacy & Security</Link>
            <span>·</span>
            <Link href="/ca-privacy" className="hover:underline">CA Privacy Rights</Link>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Terms of Use</Link>
            <span>·</span>
            <Link href="/sitemap" className="hover:underline">Site Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
