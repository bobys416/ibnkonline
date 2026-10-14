"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  ArrowUpRight,
  Send,
  Slash,
} from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (json.success && json.data?.products) {
        setProducts(json.data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmitForApproval(id: string) {
    if (!confirm("Submit this product for Master Admin publication approval?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUBMIT_FOR_APPROVAL", comments: "Operator submitted for publication review." }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Product submitted for approval!");
        setTimeout(() => setActionMessage(""), 4000);
        loadProducts();
      } else {
        alert(json.error || "Failed to submit product.");
      }
    } catch {
      alert("Error submitting product.");
    }
  }

  async function handleRequestUnlist(id: string) {
    const reason = prompt("Please provide a reason for unlisting this product from the live storefront:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REQUEST_UNLIST", reason }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Unlisting request submitted for Master Admin review.");
        setTimeout(() => setActionMessage(""), 4000);
        loadProducts();
      } else {
        alert(json.error || "Failed to submit unlisting request.");
      }
    } catch {
      alert("Error submitting unlisting request.");
    }
  }

  const filtered = products.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return [p.name, p.sku, p.brand, p.categoryName].join(" ").toLowerCase().includes(q);
    }
    return true;
  });

  function renderStatusBadge(status: string) {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Published Live
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" /> Awaiting Approval
          </span>
        );
      case "UNLISTING_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Clock className="w-3 h-3" /> Unlisting Requested
          </span>
        );
      case "UNLISTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
            <Slash className="w-3 h-3" /> Unlisted
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Product Catalogue Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative inventory, pricing, variant specifications, and publication workflow.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#FF7900] hover:bg-[#e06a00] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, SKU, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["ALL", "PUBLISHED", "PENDING_REVIEW", "DRAFT", "UNLISTED", "REJECTED"].map((st) => (
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
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading authoritative catalogue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No products match current filter.</p>
            <p className="text-xs">Adjust your search or add a new product draft.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-200">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400 m-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#172033] line-clamp-1 max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>{product.categoryName}</div>
                      <div className="text-[11px] text-slate-400">{product.brand}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">
                        {formatMoney(product.sellingPricePaise)}
                      </div>
                      {product.mrpPaise > product.sellingPricePaise && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatMoney(product.mrpPaise)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.stockQuantity === 0
                              ? "bg-red-500"
                              : product.stockQuantity <= product.lowStockThreshold
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span className="font-semibold text-slate-800">
                          {product.stockQuantity} units
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {renderStatusBadge(product.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-[#1554D1] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Submit for review button if DRAFT or REJECTED */}
                        {(product.status === "DRAFT" || product.status === "REJECTED" || product.status === "CHANGES_REQUESTED") && (
                          <button
                            onClick={() => handleSubmitForApproval(product.id)}
                            className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Submit for Approval"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        {/* Request unlisting button if PUBLISHED */}
                        {product.status === "PUBLISHED" && (
                          <button
                            onClick={() => handleRequestUnlist(product.id)}
                            className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Request Unlisting"
                          >
                            <Slash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

