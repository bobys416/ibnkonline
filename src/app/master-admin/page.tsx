import Link from "next/link";
import marketplaceStore from "@/lib/marketplace-store";
import { formatMoney } from "@/lib/money";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Store,
  DollarSign,
  FileCheck2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Network,
} from "lucide-react";

export default function MasterAdminExecutiveDashboard() {
  const metrics = marketplaceStore.getMasterAdminDashboardMetrics();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300/60">
              Master Admin Control Center
            </span>
            <span className="text-xs text-slate-500">• Single Authoritative Source of Truth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#172033] tracking-tight mt-2">
            Marketplace Executive Governance
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative visibility over catalogue publication, merchant licenses, financial ledger, and territory distribution.
          </p>
        </div>

        {/* Quick Link to Central Approval Queue */}
        <Link
          href="/master-admin/approvals"
          className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors w-fit"
        >
          <FileCheck2 className="w-4 h-4 text-amber-300" />
          <span>Approval Queue ({metrics.pendingProductApprovals + metrics.pendingMerchantApplications})</span>
        </Link>
      </div>

      {/* Primary Financial Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gross Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Order Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#172033]">
            {formatMoney(metrics.grossOrderValuePaise)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.paidOrderCount} verified paid orders
          </div>
        </div>

        {/* Net Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Collections</span>
            <TrendingUp className="w-4 h-4 text-[#1554D1]" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#1554D1]">
            {formatMoney(metrics.netCollectionsPaise)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Deducted {formatMoney(metrics.totalRefundsPaise)} refunds
          </div>
        </div>

        {/* Platform Commission Accrued */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Take</span>
            <span className="text-xs font-bold text-amber-600">Accrued</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-600">
            {formatMoney(metrics.totalCommissionsPaise)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across active merchant partner sales
          </div>
        </div>

        {/* Pending Approval Requests */}
        <div className="bg-white p-5 rounded-2xl border border-amber-300/80 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Decisions</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-800">
            {metrics.pendingProductApprovals + metrics.pendingMerchantApplications}
          </div>
          <div className="text-xs text-amber-800/80 mt-1">
            {metrics.pendingMerchantApplications} merchants, {metrics.pendingProductApprovals} products
          </div>
        </div>
      </div>

      {/* Network & Entity Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Active Merchants</div>
          <div className="text-3xl font-black text-white mt-2">{metrics.activeMerchantCount}</div>
          <div className="text-xs text-slate-400 mt-1">{metrics.merchantCount} total onboarded</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Distributor Hubs</div>
          <div className="text-3xl font-black text-white mt-2">{metrics.distributorCount}</div>
          <div className="text-xs text-slate-400 mt-1">Primary state territory operators</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Area Distributors</div>
          <div className="text-3xl font-black text-white mt-2">{metrics.areaDistributorCount}</div>
          <div className="text-xs text-slate-400 mt-1">Local district depot networks</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Published Store Products</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{metrics.publishedProductsCount}</div>
          <div className="text-xs text-slate-400 mt-1">Active on web & mobile apps</div>
        </div>
      </div>

      {/* Two Column Layout: Pending Action Center + Immutable Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Decision Hub (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#1554D1]" />
              <span>Pending Action Center</span>
            </h2>
            <Link
              href="/master-admin/approvals"
              className="text-xs font-semibold text-[#1554D1] hover:underline flex items-center gap-1"
            >
              <span>Review all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/master-admin/approvals?type=PRODUCT_CREATION"
              className="block p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Product Publications</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {metrics.pendingProductApprovals} Pending
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Review proposed SKUs, specifications, and prices before publishing live.
              </p>
            </Link>

            <Link
              href="/master-admin/approvals?type=MERCHANT_ONBOARDING"
              className="block p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Merchant Onboarding</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  {metrics.pendingMerchantApplications} Pending
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Verify partner GST, KYC documents, and assign distributor mapping.
              </p>
            </Link>

            <Link
              href="/master-admin/settlements"
              className="block p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Cycle Settlements</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {metrics.pendingSettlementsCount} Due
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Execute bank payouts and generate automated reconciliation statements.
              </p>
            </Link>
          </div>
        </div>

        {/* Immutable Audit Log Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Immutable Master Audit Trail</span>
            </h2>
            <Link
              href="/master-admin/audit-logs"
              className="text-xs font-semibold text-[#1554D1] hover:underline flex items-center gap-1"
            >
              <span>View full log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.recentAuditEvents.map((event) => (
              <div key={event.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="font-mono bg-slate-900 text-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                      {event.action}
                    </span>
                    <span>{event.targetEntity} #{event.targetId}</span>
                  </div>
                  {event.reason && (
                    <p className="text-slate-600 italic">“{event.reason}”</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    By {event.actorName} ({event.actorRole})
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

