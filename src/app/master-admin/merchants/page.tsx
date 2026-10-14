"use client";

import { useState, useEffect } from "react";
import { Store, CheckCircle2, AlertTriangle, Search, Edit3, ShieldAlert, Ban, RefreshCw } from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function MasterAdminMerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingMerchant, setEditingMerchant] = useState<any | null>(null);
  const [commissionRate, setCommissionRate] = useState<string>("");
  const [selectedDistributor, setSelectedDistributor] = useState<string>("");
  const [actionMessage, setActionMessage] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [mRes, dRes] = await Promise.all([
        fetch("/api/master-admin/merchants"),
        fetch("/api/master-admin/distributors"),
      ]);
      const mJson = await mRes.json();
      const dJson = await dRes.json();

      if (mJson.success && mJson.data?.merchants) {
        setMerchants(mJson.data.merchants);
      }
      if (dJson.success && dJson.data?.distributors) {
        setDistributors(dJson.data.distributors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleToggleStatus(merchant: any) {
    const newStatus = merchant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const reason = prompt(`Provide reason for setting merchant status to ${newStatus}:`);
    if (!reason) return;

    try {
      const res = await fetch("/api/master-admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: merchant.id,
          status: newStatus,
          reason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage(`Merchant ${merchant.businessName} is now ${newStatus}.`);
        setTimeout(() => setActionMessage(""), 4000);
        loadData();
      } else {
        alert(json.error || "Failed to update merchant status.");
      }
    } catch {
      alert("Error updating merchant status.");
    }
  }

  async function handleSaveSettings() {
    if (!editingMerchant) return;
    try {
      const res = await fetch("/api/master-admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: editingMerchant.id,
          commissionRatePercent: parseFloat(commissionRate),
          distributorId: selectedDistributor,
          reason: "Master Admin updated commission / territory distributor assignment",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Merchant configuration saved successfully!");
        setTimeout(() => setActionMessage(""), 4000);
        setEditingMerchant(null);
        loadData();
      } else {
        alert(json.error || "Failed to save settings.");
      }
    } catch {
      alert("Error saving merchant settings.");
    }
  }

  const filtered = merchants.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [m.businessName, m.contactPerson, m.email, m.city, m.gstNumber || ""].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Merchant Governance & Accounts
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative directory, operational status, take rates, and distributor associations.
          </p>
        </div>

        <button
          onClick={loadData}
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

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by merchant, city, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
          />
        </div>
      </div>

      {/* Merchant Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading merchants...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No merchants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Merchant Name</th>
                  <th className="py-3 px-4">Category & Location</th>
                  <th className="py-3 px-4">Assigned Distributor</th>
                  <th className="py-3 px-4">Commission %</th>
                  <th className="py-3 px-4">GMV Settled</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{m.businessName}</div>
                      <div className="text-xs text-slate-500">{m.contactPerson} • {m.email}</div>
                      {m.gstNumber && (
                        <div className="text-[11px] font-mono text-slate-400">GSTIN: {m.gstNumber}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div className="text-slate-800 font-semibold">{m.businessCategory}</div>
                      <div className="text-slate-500">{m.city}, {m.state} ({m.pinCode})</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      {m.distributorName ? (
                        <span className="font-medium text-slate-800">{m.distributorName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned Hub</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {m.commissionRatePercent}%
                    </td>

                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700">
                      {formatMoney(m.gmvPaise || 0)}
                    </td>

                    <td className="py-3 px-4">
                      {m.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Active Partner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingMerchant(m);
                            setCommissionRate(String(m.commissionRatePercent));
                            setSelectedDistributor(m.distributorId || "");
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#1554D1] hover:bg-slate-100 rounded-lg"
                        >
                          Configure
                        </button>

                        <button
                          onClick={() => handleToggleStatus(m)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            m.status === "ACTIVE"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {m.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Drawer / Modal */}
      {editingMerchant && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-[#172033]">
              Configure Merchant: {editingMerchant.businessName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Commission Rate (% Platform Take)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Territorial Distributor Hub
                </label>
                <select
                  value={selectedDistributor}
                  onChange={(e) => setSelectedDistributor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
                >
                  <option value="">No Distributor (Direct Fulfillment)</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.businessName} ({d.operationalTerritory})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingMerchant(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-xs font-bold bg-[#1554D1] text-white hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

