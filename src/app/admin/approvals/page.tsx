"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSubmittedRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Submitted Approval Requests
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track Master Admin decisions, change requests, and feedback on catalogue proposals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No approval requests submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Request #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Decision Feedback</th>
                  <th className="py-3 px-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-xs">
                      {req.requestNumber}
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                      {req.type.replace(/_/g, " ")}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {req.title}
                    </td>

                    <td className="py-3 px-4">
                      {req.status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : req.status === "REJECTED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : req.status === "CHANGES_REQUESTED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <HelpCircle className="w-3 h-3" /> Changes Requested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3" /> In Review
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600">
                      {req.decisionReason || "—"}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
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

