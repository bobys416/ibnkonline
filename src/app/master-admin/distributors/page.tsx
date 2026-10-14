"use client";

import { useState, useEffect } from "react";
import { Network, PlusCircle, CheckCircle2, Search, MapPin, Building, ShieldCheck } from "lucide-react";

export default function MasterAdminDistributorsPage() {
  const [distributors, setDistributors] = useState<any[]>([]);
  const [areaDistributors, setAreaDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"DISTRIBUTORS" | "AREA_DISTRIBUTORS">("DISTRIBUTORS");
  const [showAddDistributor, setShowAddDistributor] = useState(false);
  const [showAddAreaDist, setShowAddAreaDist] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const [distForm, setDistForm] = useState({
    distributorCode: "",
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    registeredAddress: "",
    state: "Maharashtra",
    district: "Mumbai",
    pinCode: "",
    operationalTerritory: "",
    commissionRatePercent: "2.5",
  });

  const [areaForm, setAreaForm] = useState({
    code: "",
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    state: "Maharashtra",
    district: "Mumbai City",
    pinCode: "",
    distributorId: "",
    commissionRatePercent: "1.5",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [dRes, adRes] = await Promise.all([
        fetch("/api/master-admin/distributors"),
        fetch("/api/master-admin/area-distributors"),
      ]);
      const dJson = await dRes.json();
      const adJson = await adRes.json();

      if (dJson.success && dJson.data?.distributors) setDistributors(dJson.data.distributors);
      if (adJson.success && adJson.data?.areaDistributors) setAreaDistributors(adJson.data.areaDistributors);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddDistributor(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/master-admin/distributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...distForm,
          commissionRatePercent: parseFloat(distForm.commissionRatePercent),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Distributor registered successfully!");
        setTimeout(() => setActionMessage(""), 3000);
        setShowAddDistributor(false);
        loadData();
      } else {
        alert(json.error || "Failed to create distributor.");
      }
    } catch {
      alert("Error creating distributor.");
    }
  }

  async function handleAddAreaDist(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/master-admin/area-distributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...areaForm,
          commissionRatePercent: parseFloat(areaForm.commissionRatePercent),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Area Distributor registered successfully!");
        setTimeout(() => setActionMessage(""), 3000);
        setShowAddAreaDist(false);
        loadData();
      } else {
        alert(json.error || "Failed to create Area Distributor.");
      }
    } catch {
      alert("Error creating Area Distributor.");
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Distribution Network & Hierarchy
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            State territory hubs, district quick commerce depots, and merchant logistics coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "DISTRIBUTORS" ? (
            <button
              onClick={() => setShowAddDistributor(!showAddDistributor)}
              className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Primary Distributor</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddAreaDist(!showAddAreaDist)}
              className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Area Distributor</span>
            </button>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("DISTRIBUTORS")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "DISTRIBUTORS"
              ? "border-[#1554D1] text-[#1554D1]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Primary Distributors ({distributors.length})
        </button>

        <button
          onClick={() => setActiveTab("AREA_DISTRIBUTORS")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "AREA_DISTRIBUTORS"
              ? "border-[#1554D1] text-[#1554D1]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Area Distributors / Depots ({areaDistributors.length})
        </button>
      </div>

      {/* Primary Distributors Table */}
      {activeTab === "DISTRIBUTORS" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Code / Business</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Operating Territory</th>
                  <th className="py-3 px-4">Commission %</th>
                  <th className="py-3 px-4">Subordinate Area Depots</th>
                  <th className="py-3 px-4">Assigned Merchants</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {distributors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{d.businessName}</div>
                      <div className="text-xs font-mono text-slate-500">{d.distributorCode}</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div>{d.contactPerson}</div>
                      <div className="text-slate-500">{d.phone} • {d.email}</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div className="font-semibold text-slate-800">{d.operationalTerritory}</div>
                      <div className="text-slate-500">{d.state} ({d.pinCode})</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {d.commissionRatePercent}%
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {d.assignedAreaDistributorCount} depots
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {d.assignedMerchantCount} partners
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Area Distributors Table */}
      {activeTab === "AREA_DISTRIBUTORS" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Depot Code / Business</th>
                  <th className="py-3 px-4">Parent Distributor Hub</th>
                  <th className="py-3 px-4">Coverage PIN Codes</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Commission %</th>
                  <th className="py-3 px-4">Assigned Merchants</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {areaDistributors.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{ad.businessName}</div>
                      <div className="text-xs font-mono text-slate-500">{ad.code}</div>
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-slate-800">
                      {ad.distributorName}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600">
                      {ad.territoryPinCodes?.join(", ") || ad.pinCode}
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div>{ad.contactPerson}</div>
                      <div className="text-slate-500">{ad.phone}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {ad.commissionRatePercent}%
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {ad.assignedMerchantCount} partners
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {ad.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

