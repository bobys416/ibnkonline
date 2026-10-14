"use client";

import { useState, useEffect } from "react";
import { DollarSign, CheckCircle2, Search, ArrowDownRight, RefreshCw } from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function MasterAdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/master-admin/transactions");
      const json = await res.json();
      if (json.success && json.data?.transactions) {
        setTransactions(json.data.transactions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [t.orderNumber, t.providerTxnId, t.merchantName || "", t.provider].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Financial Ledger & Payment Reconciliation
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative transactional entries linked to payment provider references and orders.
          </p>
        </div>

        <button
          onClick={loadTransactions}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, gateway reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading financial ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No transaction records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Transaction / Order</th>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Merchant Partner</th>
                  <th className="py-3 px-4">Amount Captured</th>
                  <th className="py-3 px-4">Platform Fee</th>
                  <th className="py-3 px-4">Net Payout Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 font-sans">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033] font-mono">{t.orderNumber}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {t.id}</div>
                    </td>

                    <td className="py-3 px-4 text-xs font-mono">
                      <div className="font-semibold text-slate-800">{t.providerTxnId}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{t.provider} • {t.paymentMethod}</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      {t.merchantName || "iBNK Central Retail"}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {formatMoney(t.amountPaise)}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-600">
                      {formatMoney(t.commissionPaise)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {formatMoney(t.netPayoutPaise)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> {t.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

