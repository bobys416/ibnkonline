import Link from "next/link";
import marketplaceStore from "@/lib/marketplace-store";
import {
  Package,
  Layers,
  Store,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Activity,
} from "lucide-react";

export default function OperationsDashboardPage() {
  const metrics = marketplaceStore.getOperationsDashboardMetrics();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#1554D1] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              Operations Center
            </span>
            <span className="text-xs text-slate-500">• Wadala Central Hub Link</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#172033] tracking-tight mt-2">
            Product & Merchant Operations
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative catalogue editing, inventory oversight, and merchant intake queue.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#FF7900] hover:bg-[#e06a00] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Product Draft</span>
          </Link>
          <Link
            href="/admin/merchants/onboarding"
            className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Merchant Intake</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalogue Scope</span>
            <Package className="w-4 h-4 text-[#1554D1]" />
          </div>
          <div className="text-3xl font-black text-[#172033]">{metrics.totalProducts}</div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.published} Published Live on Storefront
          </div>
        </div>

        {/* Drafts & In-Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts & Edits</span>
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-800">{metrics.drafts}</div>
          <div className="text-xs text-slate-500 mt-1">
            Unpublished internal drafts
          </div>
        </div>

        {/* Pending Master Admin Approval */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Master Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-700">{metrics.pendingReview}</div>
          <div className="text-xs text-amber-700/80 mt-1">
            Listing change requests in queue
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-red-200/80 bg-red-50/20 shadow-sm">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Warnings</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-700">
            {metrics.lowStock + metrics.outOfStock}
          </div>
          <div className="text-xs text-red-700/80 mt-1">
            {metrics.outOfStock} out of stock, {metrics.lowStock} low
          </div>
        </div>
      </div>

      {/* Two Column Layout: Merchant Intake + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merchant Onboarding Intake Overview (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#1554D1]" />
              <span>Merchant Intake Status</span>
            </h2>
            <Link
              href="/admin/merchants/onboarding"
              className="text-xs font-semibold text-[#1554D1] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Product Operations key intake applications. Final verification and account activation is strictly reserved for Master Admin Control Center.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Submitted Intake</span>
              <span className="text-2xl font-black text-[#172033] mt-1 block">
                {metrics.submittedApplications}
              </span>
            </div>
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/60">
              <span className="text-[11px] font-semibold text-blue-700 block uppercase">Under Review</span>
              <span className="text-2xl font-black text-[#1554D1] mt-1 block">
                {metrics.awaitingMasterReview}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2">Operational Safeguard Notice</div>
            <div className="text-[11px] text-slate-500 bg-amber-50 text-amber-900 border border-amber-200/60 p-3 rounded-xl leading-relaxed">
              Separation of Duties is active. Operations operators cannot self-approve merchant applications or mark products as published.
            </div>
          </div>
        </div>

        {/* Recent Operator Activity & Audit Stream (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF7900]" />
              <span>Recent Operational Actions</span>
            </h2>
            <span className="text-xs text-slate-400">Authoritative Audit Stream</span>
          </div>

          {metrics.recentActivity.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No recent operational actions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {metrics.recentActivity.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                      <span>Target: {log.targetEntity} #{log.targetId}</span>
                    </div>
                    {log.reason && (
                      <p className="text-slate-600 italic">“{log.reason}”</p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      By {log.actorName} ({log.actorRole})
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

