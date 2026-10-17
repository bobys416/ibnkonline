"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Package,
  Layers,
  Store,
  Clock,
  AlertTriangle,
  PlusCircle,
  FileText,
  Activity,
  ArrowUpRight,
  X,
} from "lucide-react";
import marketplaceStore from "@/lib/marketplace-store";

interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
  company: string;
  budget: string;
  date: string;
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED";
}

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Rishabh Kumar Sharma",
    email: "rishabh.sharma41990@gmail.com",
    service: "web-dev",
    company: "ibnk",
    budget: "$10k - $25k",
    date: "10/14/2026",
    status: "NEW",
  },
  {
    id: "lead-2",
    name: "Aman Verma",
    email: "aman.verma@apexretail.in",
    service: "merchant-onboarding",
    company: "Apex Retailers Ltd",
    budget: "$25k - $50k",
    date: "10/16/2026",
    status: "IN_PROGRESS",
  },
  {
    id: "lead-3",
    name: "Pooja Malhotra",
    email: "p.malhotra@zenithsupply.com",
    service: "catalogue-integration",
    company: "Zenith Supplies",
    budget: "$5k - $10k",
    date: "10/17/2026",
    status: "NEW",
  },
];

export default function AdminDashboardPage() {
  const metrics = marketplaceStore.getOperationsDashboardMetrics();

  // Active view tab: Leads or Marketplace Ops
  const [activeTab, setActiveTab] = useState<"leads" | "operations">("leads");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      statusFilter === "All" ||
      (statusFilter === "New" && lead.status === "NEW") ||
      (statusFilter === "In Progress" && lead.status === "IN_PROGRESS") ||
      (statusFilter === "Contacted" && lead.status === "CONTACTED") ||
      (statusFilter === "Closed" && lead.status === "CLOSED");

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.service.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  const exportCSV = () => {
    const csvHeader = "ID,Name,Email,Service,Company,Budget,Date,Status\n";
    const csvRows = leads
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.email}","${l.service}","${l.company}","${l.budget}","${l.date}","${l.status}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-[#060713] text-white min-h-screen flex flex-col select-none">
      {/* ======================================================== */}
      {/* 1. Top Header Bar (Exact match to media_1792233493781)    */}
      {/* ======================================================== */}
      <header className="px-6 py-4 border-b border-purple-500/20 bg-[#09061A]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Client Leads &amp; Project Inquiries
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <p className="text-xs text-purple-200/60 mt-0.5">
            Manage, filter, triage and export incoming requests across all registered websites
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* PostgreSQL Active Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL Active</span>
          </div>

          {/* Super Admin Avatar with green online ring */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#181135] flex items-center justify-center font-bold text-xs text-white">
                SA
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#09061A]" />
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
        {/* Navigation Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "leads"
                  ? "bg-purple-600/30 border border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Leads &amp; Inquiries ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("operations")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "operations"
                  ? "bg-purple-600/30 border border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Marketplace Operations Center
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 bg-[#FF7900] hover:bg-[#e06a00] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Product</span>
            </Link>
            <Link
              href="/admin/merchants/onboarding"
              className="flex items-center gap-1.5 bg-[#1554D1] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Intake</span>
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: Leads & Inquiries View (Screenshot Faithful)      */}
        {/* ======================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Toolbar: Search + Filter Pills + Export CSV */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads by name, email, company, service..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0E0A24]/90 border border-purple-500/20 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Status Filter Pills & Export Button */}
              <div className="flex flex-wrap items-center gap-2">
                {["All", "New", "In Progress", "Contacted", "Closed"].map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setStatusFilter(pill)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      statusFilter === pill
                        ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "bg-white/5 border border-purple-500/20 text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {pill}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Cosmic Dark Table */}
            <div className="rounded-2xl border border-purple-500/20 bg-[#0A071E]/80 backdrop-blur-md overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#120B2E]/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-purple-500/20">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Company &amp; Service</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/20 text-slate-300">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No matching inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          {/* CONTACT */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm">{lead.name}</div>
                            <div className="text-[11px] text-slate-400">{lead.email}</div>
                          </td>

                          {/* COMPANY & SERVICE */}
                          <td className="py-3 px-4">
                            <div className="text-white font-medium">{lead.service}</div>
                            <div className="text-[11px] text-slate-400">{lead.company}</div>
                          </td>

                          {/* BUDGET (Vibrant Cyan #00E5FF) */}
                          <td className="py-3 px-4 font-bold text-[#00E5FF] text-sm">
                            {lead.budget}
                          </td>

                          {/* DATE */}
                          <td className="py-3 px-4 text-slate-400">
                            {lead.date}
                          </td>

                          {/* STATUS (Dropdown pill) */}
                          <td className="py-3 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as Lead["status"])
                              }
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border outline-none cursor-pointer ${
                                lead.status === "NEW"
                                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                                  : lead.status === "IN_PROGRESS"
                                    ? "bg-amber-950/60 border-amber-500/50 text-amber-300"
                                    : lead.status === "CONTACTED"
                                      ? "bg-blue-950/60 border-blue-500/50 text-blue-300"
                                      : "bg-slate-900 border-slate-700 text-slate-400"
                              }`}
                            >
                              <option value="NEW" className="bg-[#0A071E] text-emerald-400">NEW</option>
                              <option value="IN_PROGRESS" className="bg-[#0A071E] text-amber-300">IN PROGRESS</option>
                              <option value="CONTACTED" className="bg-[#0A071E] text-blue-300">CONTACTED</option>
                              <option value="CLOSED" className="bg-[#0A071E] text-slate-400">CLOSED</option>
                            </select>
                          </td>

                          {/* ACTIONS */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedLead(lead)}
                                className="p-1 rounded text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/40 transition-colors"
                                title="View Lead Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: Marketplace Operations Center View               */}
        {/* ======================================================== */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            {/* Aggregate Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0A071E]/80 border border-purple-500/20 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between text-purple-300 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Catalogue Scope</span>
                  <Package className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white">{metrics.totalProducts}</div>
                <div className="text-xs text-purple-200/60 mt-1">
                  {metrics.published} Published Live on Storefront
                </div>
              </div>

              <div className="bg-[#0A071E]/80 border border-purple-500/20 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between text-purple-300 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Drafts &amp; Edits</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">{metrics.drafts}</div>
                <div className="text-xs text-purple-200/60 mt-1">
                  Unpublished internal drafts
                </div>
              </div>

              <div className="bg-[#0A071E]/80 border border-amber-500/30 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Review</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-300">{metrics.pendingReview}</div>
                <div className="text-xs text-amber-400/80 mt-1">
                  Listing change requests in queue
                </div>
              </div>

              <div className="bg-[#0A071E]/80 border border-rose-500/30 p-5 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between text-rose-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Inventory Warnings</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-rose-400">
                  {metrics.lowStock + metrics.outOfStock}
                </div>
                <div className="text-xs text-rose-300/80 mt-1">
                  {metrics.outOfStock} out of stock, {metrics.lowStock} low
                </div>
              </div>
            </div>

            {/* Merchant Intake Queue & Audit Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#0A071E]/80 border border-purple-500/20 p-6 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-cyan-400" />
                    <span>Merchant Intake Status</span>
                  </h3>
                  <Link
                    href="/admin/merchants/onboarding"
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-purple-200/60 leading-relaxed">
                  Key merchant intake applications. Final verification is verified by Master Admin Hub.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-purple-500/20">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">Submitted Intake</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {metrics.submittedApplications}
                    </span>
                  </div>
                  <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-500/30">
                    <span className="text-[11px] font-semibold text-blue-300 block uppercase">Under Review</span>
                    <span className="text-2xl font-black text-cyan-400 mt-1 block">
                      {metrics.awaitingMasterReview}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0A071E]/80 border border-purple-500/20 p-6 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FF7900]" />
                    <span>Recent Operational Actions</span>
                  </h3>
                  <span className="text-xs text-purple-200/60">Audit Stream</span>
                </div>

                {metrics.recentActivity.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    No recent operational actions recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-purple-900/20 max-h-64 overflow-y-auto">
                    {metrics.recentActivity.map((log) => (
                      <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span className="font-mono bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded text-[10px]">
                              {log.action}
                            </span>
                            <span>Target: {log.targetEntity} #{log.targetId}</span>
                          </div>
                          {log.reason && (
                            <p className="text-slate-300 italic">“{log.reason}”</p>
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
        )}
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#0E0A24] border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <h3 className="text-base font-bold text-white">Lead Details</h3>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Contact Name:</span>
                <span className="text-white font-bold text-sm">{selectedLead.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Service:</span>
                  <span className="text-white font-semibold">{selectedLead.service}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Company:</span>
                  <span className="text-white font-semibold">{selectedLead.company}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Estimated Budget:</span>
                  <span className="text-[#00E5FF] font-bold">{selectedLead.budget}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date Received:</span>
                  <span className="text-white font-semibold">{selectedLead.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-500/20 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
