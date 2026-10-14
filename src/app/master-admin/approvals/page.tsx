"use client";

import { useState, useEffect } from "react";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Package,
  Store,
  Slash,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function MasterAdminApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/master-admin/approvals");
      const json = await res.json();
      if (json.success && json.data?.requests) {
        setRequests(json.data.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleDecision(requestId: string, decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES", reason?: string) {
    if (decision === "REJECT" && !reason) {
      alert("A reason is required when rejecting a request.");
      return;
    }

    try {
      const res = await fetch("/api/master-admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision, reason }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage(json.data?.message || `Request ${decision.toLowerCase()}d successfully.`);
        setTimeout(() => setActionMessage(""), 4000);
        setSelectedReq(null);
        setRejectingId(null);
        setRejectReason("");
        loadRequests();
      } else {
        alert(json.error || "Failed to process decision.");
      }
    } catch {
      alert("Network error processing decision.");
    }
  }

  const filtered = requests.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Authority Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight mt-1">
            Centralized Approval Center
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Single unified decision queue for catalogue publications, merchant activation, and store unlistings.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {["PENDING", "APPROVED", "REJECTED", "CHANGES_REQUESTED", "ALL"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-[#1554D1] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Type:</span>
          {[
            { label: "All Types", val: "ALL" },
            { label: "Products", val: "PRODUCT_CREATION" },
            { label: "Merchants", val: "MERCHANT_ONBOARDING" },
            { label: "Unlistings", val: "PRODUCT_UNLIST" },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => setTypeFilter(t.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === t.val
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200 text-sm">
            Loading approval queue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200 text-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-700">Zero Pending Items in Queue</p>
            <p className="text-xs text-slate-500">All submissions have been reviewed or decided.</p>
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-4 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    {req.type === "PRODUCT_CREATION" ? (
                      <Package className="w-5 h-5 text-blue-600" />
                    ) : req.type === "MERCHANT_ONBOARDING" ? (
                      <Store className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Slash className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {req.requestNumber}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                        {req.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#172033] mt-0.5">
                      {req.title}
                    </h3>
                  </div>
                </div>

                <div>
                  {req.status === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Executed
                    </span>
                  ) : req.status === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  ) : req.status === "CHANGES_REQUESTED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <HelpCircle className="w-3.5 h-3.5" /> Changes Requested
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      <Clock className="w-3.5 h-3.5" /> Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Proposed Payload Comparison */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  Proposed Changes / Payload Snapshot:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-600 font-mono">
                  {Object.entries(req.proposedData || {}).map(([key, val]) => (
                    <div key={key} className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-sans uppercase font-bold">{key}</div>
                      <div className="font-semibold text-slate-800 truncate">
                        {typeof val === "number" && key.toLowerCase().includes("paise")
                          ? formatMoney(val)
                          : String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitter Info and Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 text-xs">
                <div className="text-slate-500">
                  Submitted by <span className="font-semibold text-slate-800">{req.submittedByName}</span> ({req.submittedBy}) on {new Date(req.createdAt).toLocaleString()}
                </div>

                {req.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    {rejectingId === req.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Mandatory rejection reason..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 w-56"
                        />
                        <button
                          onClick={() => handleDecision(req.id, "REJECT", rejectReason)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="text-slate-500 text-xs hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDecision(req.id, "REQUEST_CHANGES", "Operator requested to revise attributes/pricing.")}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(req.id);
                            setRejectReason("");
                          }}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, "APPROVE")}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                        >
                          Approve & Publish Live
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

