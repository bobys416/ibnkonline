"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Slash, AlertCircle, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";

function EditProductContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    categorySlug: "grocery",
    brand: "",
    mrp: "0",
    sellingPrice: "0",
    taxCategory: "GST_18",
    stockQuantity: "0",
    lowStockThreshold: "5",
    description: "",
    imageUrl: "",
    status: "",
    isCodEligible: true,
    freeShipping: false,
    reason: "",
  });

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const json = await res.json();
        if (json.success && json.data?.product) {
          const p = json.data.product;
          setForm({
            name: p.name,
            sku: p.sku,
            categorySlug: p.categorySlug,
            brand: p.brand || "",
            mrp: (p.mrpPaise / 100).toFixed(2),
            sellingPrice: (p.sellingPricePaise / 100).toFixed(2),
            taxCategory: p.taxCategory || "GST_18",
            stockQuantity: String(p.stockQuantity),
            lowStockThreshold: String(p.lowStockThreshold || 5),
            description: p.description || "",
            imageUrl: p.images?.[0] || "",
            status: p.status,
            isCodEligible: Boolean(p.isCodEligible),
            freeShipping: Boolean(p.freeShipping),
            reason: "",
          });
        } else {
          setError("Product not found.");
        }
      } catch {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setBusy(true);
    setError("");
    setSuccess("");

    const mrpPaise = Math.round(parseFloat(form.mrp) * 100);
    const sellingPricePaise = Math.round(parseFloat(form.sellingPrice) * 100);

    if (sellingPricePaise > mrpPaise) {
      setError("Selling price cannot exceed MRP.");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          brand: form.brand,
          categorySlug: form.categorySlug,
          mrpPaise,
          sellingPricePaise,
          stockQuantity: parseInt(form.stockQuantity, 10),
          lowStockThreshold: parseInt(form.lowStockThreshold, 10),
          description: form.description,
          images: [form.imageUrl],
          isCodEligible: form.isCodEligible,
          freeShipping: form.freeShipping,
          reason: form.reason || "Product details updated via Operations Portal",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to update product.");
        return;
      }

      setSuccess("Product updated successfully!");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch {
      setError("Network error while updating product.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitForReview() {
    if (!confirm("Submit this product change for Master Admin review?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUBMIT_FOR_APPROVAL", comments: form.reason }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Change request submitted for Master Admin review!");
        setTimeout(() => router.push("/admin/products"), 1200);
      } else {
        setError(json.error || "Failed to submit request.");
      }
    } catch {
      setError("Network error submitting request.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-slate-500 text-sm">Loading product record...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
        <Link
          href="/admin/products"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Edit Product: {form.name}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            SKU: {form.sku} • Current Status: {form.status}
          </p>
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

      {/* Form Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              className="w-full px-3.5 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">MRP (₹)</label>
            <input
              type="number"
              step="0.01"
              value={form.mrp}
              onChange={(e) => setForm({ ...form, mrp: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Low Stock Threshold</label>
            <input
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Change Reason / Operational Audit Note
            </label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Price revised per distributor agreement or festive campaign"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={busy}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Updates</span>
          </button>

          {form.status !== "PUBLISHED" && (
            <button
              type="button"
              disabled={busy}
              onClick={handleSubmitForReview}
              className="flex items-center gap-2 bg-[#FF7900] hover:bg-[#e06a00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Approval</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-sm">Loading editor…</div>}>
      <EditProductContent />
    </Suspense>
  );
}
