"use client";

import { useState, useEffect } from "react";
import { ScrollText, Search, Filter, RefreshCw } from "lucide-react";

export default function MasterAdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/master-admin/audit-logs");
      const json = await res.json();
      if (json.success && json.data?.logs) {
        setLogs(json.data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (moduleFilter !== "ALL" && l.module !== moduleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [l.action, l.actorName, l.targetEntity, l.reason || ""].join(" ").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Immutable Master Audit Trail
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tamper-evident record of all catalogue approvals, onboarding decisions, financial payouts, and role grants.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, actor, target entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["ALL", "products", "merchants", "distributors", "approvals", "financials", "users"].map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                moduleFilter === mod
                  ? "bg-[#1554D1] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mod.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading audit records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No audit records match your query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Details / Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-sans">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold bg-slate-900 text-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{log.targetEntity}</span>
                      <span className="text-[11px] font-mono text-slate-400 block">ID: {log.targetId}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-md">
                      {log.reason && (
                        <p className="font-medium text-slate-800 italic mb-0.5">“{log.reason}”</p>
                      )}
                      {log.details && (
                        <pre className="text-[10px] font-mono bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto">
                          {JSON.stringify(log.details)}
                        </pre>
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

