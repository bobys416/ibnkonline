import Link from "next/link";
import { Briefcase, Users, HeartHandshake, ChevronRight, MapPin, Send } from "lucide-react";

export const metadata = {
  title: "Careers | iBNK Marketplace",
  description: "Join our team at iBNK. Explore opportunities in operations, logistics, software engineering, and merchant development.",
};

export default function CareersPage() {
  const openings = [
    {
      title: "Full Stack Engineer (Next.js / TypeScript)",
      department: "Technology & Engineering",
      location: "Mumbai (Wadala) / Hybrid",
      type: "Full-time",
      description: "Build robust, scalable e-commerce infrastructure, payment microservices, and mobile-first storefront experiences.",
    },
    {
      title: "Warehouse & Fulfillment Supervisor",
      department: "Logistics & Supply Chain",
      location: "Mumbai (Wadala Hub)",
      type: "Full-time",
      description: "Manage daily order packing, dispatch SLAs, reverse logistics, and courier partner handovers.",
    },
    {
      title: "Merchant Growth & Onboarding Specialist",
      department: "Seller Partnerships",
      location: "Mumbai / Remote",
      type: "Full-time",
      description: "Identify, onboard, and support local retailers and D2C brands across India on the iBNK platform.",
    },
    {
      title: "Customer Support Executive (Voice & Chat)",
      department: "Customer Experience",
      location: "Mumbai (Wadala)",
      type: "Full-time",
      description: "Assist shoppers with real-time order inquiries, shipment status, returns, and dispute resolutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Careers</span>
        </nav>

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1554D1] to-[#0A2E80] p-8 sm:p-12 text-white space-y-4 shadow-md">
          <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold tracking-wide uppercase text-white">
            Work With Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Build the future of Indian retail with iBNK
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            We are creating an equitable, technology-powered e-commerce network that connects Indian shops with millions of shoppers.
          </p>
        </div>

        {/* Culture highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Collaborative Culture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast-paced, supportive environment where every team member has direct ownership and impact.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FF7900] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Rapid Career Growth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Opportunities to lead high-impact logistics, software, and commercial initiatives.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">Competitive Benefits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Health coverage, performance bonuses, employee marketplace discounts, and flexible work options.
            </p>
          </div>
        </div>

        {/* Open Positions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#172033]">Current Openings</h2>
          <div className="space-y-3">
            {openings.map((job) => (
              <div
                key={job.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-[#1554D1]/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#172033]">{job.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{job.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#1554D1]">
                      {job.type}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {job.description}
                </p>
                <div className="pt-1">
                  <a
                    href={`mailto:contact@ibnk.online?subject=Application:%20${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1554D1] hover:underline"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply via email (contact@ibnk.online)
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Application */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Don&apos;t see the right role?</h3>
            <p className="text-xs text-slate-500">
              Send your CV and a brief note to our talent team at contact@ibnk.online.
            </p>
          </div>
          <a
            href="mailto:contact@ibnk.online?subject=General%20Career%20Inquiry"
            className="rounded-xl bg-[#1554D1] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#0E44B0] transition-colors shrink-0"
          >
            Send General Application
          </a>
        </div>
      </div>
    </div>
  );
}

