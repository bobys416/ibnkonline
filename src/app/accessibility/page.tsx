import Link from "next/link";
import { Eye, Keyboard, Sparkles, ChevronRight, Check } from "lucide-react";

export const metadata = {
  title: "Accessibility Statement | iBNK Marketplace",
  description: "iBNK is committed to digital accessibility for all customers, adhering to WCAG 2.1 Level AA standards.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Accessibility</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#172033] tracking-tight">Accessibility Statement</h1>
          <p className="text-sm text-slate-600">
            Our ongoing commitment to making e-commerce accessible, inclusive, and barrier-free for everyone.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Clear Contrast & Readability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Carefully calibrated text and UI colors meeting WCAG 2.1 AA standards for high readability.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Full Keyboard Navigation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All interactive links, search inputs, carts, and checkout buttons are operable via keyboard.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Screen Reader Friendly</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Semantic HTML5 landmark tags, descriptive ARIA attributes, and clear alt tags on product imagery.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">1. Accessibility Guidelines & Standards</h2>
            <p>
              iBNK is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards, aiming for conformance with the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">2. Features Implemented on iBNK</h2>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Focus Indicators:</strong> High-contrast focus rings appear on all actionable elements when navigating with a keyboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Reduced Motion:</strong> We respect the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">prefers-reduced-motion</code> browser setting to minimize non-essential transitions and animations.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Descriptive Labels:</strong> Icon-only controls such as the cart, wishlist, and menu toggles include explicit aria-label descriptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Responsive Text Scaling:</strong> Layouts adapt gracefully when browser zoom or font scaling is increased up to 200%.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172033]">3. Feedback & Contact</h2>
            <p>
              We welcome your feedback on the accessibility of the iBNK website. If you encounter accessibility barriers or have difficulty browsing any part of our platform, please let us know:
            </p>
            <p>
              Email: <a href="mailto:contact@ibnk.online" className="text-[#1554D1] font-semibold hover:underline">contact@ibnk.online</a> (Subject: Accessibility Feedback)<br />
              Postal Address: Wadala, Mumbai, Maharashtra 400031, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

