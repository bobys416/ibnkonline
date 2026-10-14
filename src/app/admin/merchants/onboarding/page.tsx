"use client";

import { useState, useEffect } from "react";
import { Store, Send, CheckCircle2, AlertCircle, Clock, FileText, PlusCircle, ShieldAlert } from "lucide-react";

export default function MerchantOnboardingPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    legalName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessAddress: "",
    city: "",
    district: "",
    state: "Maharashtra",
    pinCode: "",
    businessCategory: "Grocery & Essentials",
    gstNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankName: "",
    bankBeneficiaryName: "",
    storeDetails: "",
    operationalNotes: "",
  });

  async function loadApplications() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/merchants/onboarding");
      const json = await res.json();
      if (json.success && json.data?.applications) {
        setApplications(json.data.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (!form.businessName || !form.contactPerson || !form.email || !form.phone || !form.businessAddress || !form.city || !form.pinCode) {
      setError("Please complete all mandatory intake fields.");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/merchants/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to submit onboarding application.");
        return;
      }

      setSuccess("Merchant intake application submitted! It is now pending Master Admin review.");
      setShowForm(false);
      setForm({
        businessName: "",
        legalName: "",
        contactPerson: "",
        email: "",
        phone: "",
        businessAddress: "",
        city: "",
        district: "",
        state: "Maharashtra",
        pinCode: "",
        businessCategory: "Grocery & Essentials",
        gstNumber: "",
        panNumber: "",
        bankAccountNumber: "",
        bankIfsc: "",
        bankName: "",
        bankBeneficiaryName: "",
        storeDetails: "",
        operationalNotes: "",
      });
      loadApplications();
    } catch {
      setError("Network error submitting application.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Merchant Onboarding Intake
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Capture partner applications, verify KYC readiness, and route to Master Admin for activation.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? "Hide Intake Form" : "New Partner Intake"}</span>
        </button>
      </div>

      {/* Separation of duties banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Separation of Duties Enforced:</span> Product & Merchant Operations operators may capture onboarding applications and save intake drafts. Final verification, commercial commission rate assignment, and account activation is strictly reserved for Master Admin Control Center.
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Drawer / Card */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#172033] border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#1554D1]" />
            <span>New Merchant Application Intake</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Trading Name *</label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="e.g. Sahyadri Agro Organics"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Registered Entity Name</label>
              <input
                type="text"
                value={form.legalName}
                onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                placeholder="e.g. Sahyadri Agro Products Pvt Ltd"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (+91) *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 9820012345"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Category *</label>
              <select
                value={form.businessCategory}
                onChange={(e) => setForm({ ...form, businessCategory: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              >
                <option value="Grocery & Essentials">Grocery & Essentials</option>
                <option value="Electronics & Tech">Electronics & Tech</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Home & Furniture">Home & Furniture</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Address *</label>
              <input
                type="text"
                required
                value={form.businessAddress}
                onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit PIN Code *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number (Optional)</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                placeholder="27AAAC..."
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Card Number</label>
              <input
                type="text"
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                placeholder="AAACF1234F"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                value={form.bankIfsc}
                onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })}
                placeholder="HDFC0000123"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                value={form.bankAccountNumber}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Intake Notes for Master Admin
              </label>
              <textarea
                rows={2}
                value={form.operationalNotes}
                onChange={(e) => setForm({ ...form, operationalNotes: e.target.value })}
                placeholder="e.g. Candidate confirmed wholesale manufacturing unit in Vashi. Verified contact numbers."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 bg-[#1554D1] hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Intake Application</span>
            </button>
          </div>
        </form>
      )}

      {/* Submitted Intake Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Submitted Intake Queue ({applications.length})
          </h2>
          <span className="text-xs text-slate-500">Live Status from Master Admin</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No merchant intake applications submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-4">Merchant Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {app.applicationNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{app.businessName}</div>
                      <div className="text-xs text-slate-500">{app.contactPerson} ({app.phone})</div>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600">
                      {app.businessCategory}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600">
                      {app.city}, {app.state} ({app.pinCode})
                    </td>

                    <td className="py-3 px-4">
                      {app.status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved by Master Admin
                        </span>
                      ) : app.status === "REJECTED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3" /> {app.status.replace("_", " ")}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500">
                      {app.submittedBy}
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

