"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";

export default function NewProductPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    categorySlug: "grocery",
    brand: "iBNK Essentials",
    mrp: "499",
    sellingPrice: "399",
    taxCategory: "GST_18",
    stockQuantity: "50",
    lowStockThreshold: "5",
    description: "",
    shortDescription: "",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    isCodEligible: true,
    freeShipping: false,
    returnWindowDays: "7",
  });

  async function handleSave(submitForApproval: boolean) {
    setBusy(true);
    setError("");
    setSuccess("");

    if (!form.name || !form.sku || !form.sellingPrice || !form.stockQuantity) {
      setError("Please complete all required fields (Name, SKU, Selling Price, Stock).");
      setBusy(false);
      return;
    }

    const mrpPaise = Math.round(parseFloat(form.mrp) * 100);
    const sellingPricePaise = Math.round(parseFloat(form.sellingPrice) * 100);

    if (sellingPricePaise > mrpPaise) {
      setError("Selling price cannot exceed Maximum Retail Price (MRP).");
      setBusy(false);
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.slug === form.categorySlug);

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      categorySlug: form.categorySlug,
      categoryName: categoryObj?.name || form.categorySlug,
      brand: form.brand.trim(),
      mrpPaise,
      sellingPricePaise,
      taxCategory: form.taxCategory,
      stockQuantity: parseInt(form.stockQuantity, 10),
      lowStockThreshold: parseInt(form.lowStockThreshold, 10),
      description: form.description || form.name,
      shortDescription: form.shortDescription || form.description || form.name,
      images: [form.imageUrl.trim()],
      status: submitForApproval ? "PENDING_REVIEW" : "DRAFT",
      isCodEligible: form.isCodEligible,
      freeShipping: form.freeShipping,
      returnWindowDays: parseInt(form.returnWindowDays, 10),
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to create product record.");
        return;
      }

      setSuccess(
        submitForApproval
          ? "Product submitted for Master Admin approval!"
          : "Product draft saved successfully!"
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch {
      setError("Network error while creating product.");
    } finally {
      setBusy(false);
    }
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
            Create Product Record
          </h1>
          <p className="text-xs text-slate-500">
            Initial drafts require Master Admin approval before publishing live to the customer storefront.
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
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            1. Basic Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Fortune Sunlite Refined Sunflower Oil (5L)"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique SKU *
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. IBNK-GR-1049"
                className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Must be globally unique across all merchants.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marketplace Category *
              </label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GST Tax Classification
              </label>
              <select
                value={form.taxCategory}
                onChange={(e) => setForm({ ...form, taxCategory: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              >
                <option value="GST_0">GST 0% (Essentials, Fresh Grain)</option>
                <option value="GST_5">GST 5% (Cooking Oils, Sugar)</option>
                <option value="GST_12">GST 12% (Processed Foods)</option>
                <option value="GST_18">GST 18% (Electronics, Home)</option>
                <option value="GST_28">GST 28% (Luxury, Automotive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            2. Pricing & Warehouse Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Retail Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full px-3.5 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media & Descriptions */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            3. Media & Product Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Image URL *
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Images are validated and served through high-speed CDN.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Detailed Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe product highlights, purity, specifications, and manufacturer details..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isCodEligible}
                onChange={(e) => setForm({ ...form, isCodEligible: e.target.checked })}
                className="rounded border-slate-300 text-[#1554D1]"
              />
              <span>Cash on Delivery (COD) Eligible</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                className="rounded border-slate-300 text-[#1554D1]"
              />
              <span>Free Delivery Qualified</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={busy}
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 bg-[#FF7900] hover:bg-[#e06a00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}

