"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, RefreshCw, Send } from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function MasterAdminSettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [bankRef, setBankRef] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  async function loadSettlements() {
    setLoading(true);
    try {
      const res = await fetch("/api/master-admin/settlements");
      const json = await res.json();
      if (json.success && json.data?.settlements) {
        setSettlements(json.data.settlements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettlements();
  }, []);

  async function handleProcess(settlementId: string) {
    try {
      const res = await fetch("/api/master-admin/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settlementId,
          action: "PROCESS",
          bankRefNumber: bankRef || `NEFT-${Date.now()}`,
          notes: "Approved and dispatched via Master Admin payout workflow.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Payout executed and marked as completed!");
        setTimeout(() => setActionMessage(""), 3000);
        setProcessingId(null);
        setBankRef("");
        loadSettlements();
      } else {
        alert(json.error || "Failed to process settlement.");
      }
    } catch {
      alert("Error processing settlement.");
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Merchant & Distributor Settlements
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Weekly cycle payout statements, commission withholding, and banking reconciliation.
          </p>
        </div>

        <button
          onClick={loadSettlements}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading settlement cycles...</div>
        ) : settlements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No settlement statements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Statement #</th>
                  <th className="py-3 px-4">Beneficiary Partner</th>
                  <th className="py-3 px-4">Gross Sales</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status / Bank Ref</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {s.settlementNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{s.merchantName || "Distributor Partner"}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(s.periodStart).toLocaleDateString()} – {new Date(s.periodEnd).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {formatMoney(s.grossSalesPaise)}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-600">
                      - {formatMoney(s.commissionPaise)}
                    </td>

                    <td className="py-3 px-4 font-mono font-black text-emerald-700 text-sm">
                      {formatMoney(s.netPayoutPaise)}
                    </td>

                    <td className="py-3 px-4">
                      {s.status === "COMPLETED" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                          {s.bankRefNumber && (
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Ref: {s.bankRefNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3" /> {s.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {s.status === "PENDING" && (
                        processingId === s.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <input
                              type="text"
                              placeholder="NEFT / UTR reference"
                              value={bankRef}
                              onChange={(e) => setBankRef(e.target.value)}
                              className="px-2 py-1 text-xs border border-slate-300 rounded-lg w-32"
                            />
                            <button
                              onClick={() => handleProcess(s.id)}
                              className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setProcessingId(null)}
                              className="text-slate-400 text-xs hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setProcessingId(s.id);
                              setBankRef("");
                            }}
                            className="bg-[#1554D1] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700"
                          >
                            Execute Payout
                          </button>
                        )
                      )}
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

