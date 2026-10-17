"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Check, MapPin, Mail, ChevronDown } from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";

export function Footer() {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Mobile accordion state
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  const shopLinks = [
    { label: "All Departments", href: "/categories" },
    { label: "Deals & Offers", href: "/deals" },
    { label: "Spring Savings", href: "/spring-savings" },
    { label: "Electronics", href: "/categories/electronics" },
    { label: "Fashion", href: "/categories/fashion" },
    { label: "Grocery & Essentials", href: "/categories/grocery" },
  ];

  const supportLinks = [
    { label: "Help Center & FAQs", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Track Your Order", href: "/orders" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
  ];

  const aboutLinks = [
    { label: "About iBNK", href: "/about" },
    { label: "Get the iBNK app", href: "/apps" },
    { label: "Careers", href: "/careers" },
    { label: "Sell on iBNK", href: "/sell" },
    { label: "Operations Portal", href: "/admin" },
    { label: "Master Admin", href: "/master-admin" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="w-full bg-[#172033] text-slate-300 border-t border-slate-800 select-none">
      {/* 1. Customer Feedback & Newsletter Bar */}
      <div className="border-b border-slate-800/80 bg-[#121927] px-4 py-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-1">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <IbnkLogo variant="white" className="h-7 w-auto" width={110} height={66} />
              <span className="text-sm font-bold text-white tracking-tight">
                Stay updated with every day low price alerts
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Be the first to hear about seasonal sales, price drops, and new brand arrivals across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 sm:w-64 rounded-full bg-slate-800/90 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/30 transition-all"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#FF7900] hover:bg-[#E06A00] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => setFeedbackGiven(true)}
              className="shrink-0 flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1554D1]" />
              {feedbackGiven ? "Feedback Sent!" : "Feedback"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Directory */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <IbnkLogo variant="white" className="h-10 w-auto" width={150} height={90} />
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s trusted multi-category marketplace. Fast delivery, secure payments, and everyday low prices.
            </p>
            <p className="text-xs font-semibold text-[#FF7900] tracking-wide">
              Discover More. Shop Better.
            </p>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white md:cursor-default"
            >
              <span>Shop</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openSection === "shop" ? "rotate-180" : ""}`} />
            </button>
            <ul className={`space-y-2.5 text-xs ${openSection === "shop" ? "block" : "hidden md:block"}`}>
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection("support")}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white md:cursor-default"
            >
              <span>Customer Service</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openSection === "support" ? "rotate-180" : ""}`} />
            </button>
            <ul className={`space-y-2.5 text-xs ${openSection === "support" ? "block" : "hidden md:block"}`}>
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection("about")}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white md:cursor-default"
            >
              <span>About iBNK</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openSection === "about" ? "rotate-180" : ""}`} />
            </button>
            <ul className={`space-y-2.5 text-xs ${openSection === "about" ? "block" : "hidden md:block"}`}>
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection("legal")}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white md:cursor-default"
            >
              <span>Legal & Policies</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openSection === "legal" ? "rotate-180" : ""}`} />
            </button>
            <ul className={`space-y-2.5 text-xs ${openSection === "legal" ? "block" : "hidden md:block"}`}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Corporate Hub & Contact Strip */}
      <div className="border-t border-slate-800 bg-[#121927] px-4 py-4 text-xs text-slate-400">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#FF7900]" />
            <span className="font-semibold text-slate-200">Fulfillment Hub:</span>
            <span>Wadala, Mumbai, Maharashtra 400031, India</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#1554D1]" />
              <a href="mailto:contact@ibnk.online" className="hover:underline text-slate-200">
                contact@ibnk.online
              </a>
            </div>
            <span>·</span>
            <span>Website: <strong className="text-white">iBNK.online</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Copyright Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-[#0E1420] py-5 text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 iBNK Marketplace. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px]">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
            <span>·</span>
            <Link href="/shipping" className="hover:text-slate-300 transition-colors">Shipping</Link>
            <span>·</span>
            <Link href="/returns" className="hover:text-slate-300 transition-colors">Returns</Link>
            <span>·</span>
            <Link href="/accessibility" className="hover:text-slate-300 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
