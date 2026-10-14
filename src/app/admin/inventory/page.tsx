"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Search, RefreshCw, Plus, Minus, Package } from "lucide-react";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [message, setMessage] = useState("");

  async function loadInventory() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const json = await res.json();
      if (json.success && json.data?.items) {
        setItems(json.data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleAdjustSubmit(productId: string) {
    if (!adjustValue) return;
    const qty = parseInt(adjustValue, 10);
    if (isNaN(qty) || qty < 0) {
      alert("Please enter a valid non-negative inventory number.");
      return;
    }

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          newStockQuantity: qty,
          reason: adjustReason || "Warehouse inventory count reconciliation",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("Inventory updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        setAdjustingId(null);
        setAdjustValue("");
        setAdjustReason("");
        loadInventory();
      } else {
        alert(json.error || "Failed to update stock.");
      }
    } catch {
      alert("Error updating inventory.");
    }
  }

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [item.name, item.sku, item.categoryName].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Inventory & Warehouse Oversight
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time stock monitoring, threshold alerts, and auditable physical reconciliation.
          </p>
        </div>

        <button
          onClick={loadInventory}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1554D1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading stock levels...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{item.name}</div>
                      <div className="text-xs text-slate-500 font-mono">SKU: {item.sku}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {item.categoryName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-base text-[#172033]">
                        {item.stockQuantity}
                      </span>{" "}
                      <span className="text-xs text-slate-400">units</span>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500">
                      {item.lowStockThreshold} units
                    </td>

                    <td className="py-3 px-4">
                      {item.isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : item.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {adjustingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={adjustValue}
                            onChange={(e) => setAdjustValue(e.target.value)}
                            className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1554D1]"
                          />
                          <input
                            type="text"
                            placeholder="Reason"
                            value={adjustReason}
                            onChange={(e) => setAdjustReason(e.target.value)}
                            className="w-32 px-2 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1554D1]"
                          />
                          <button
                            onClick={() => handleAdjustSubmit(item.id)}
                            className="bg-[#1554D1] text-white px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setAdjustingId(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAdjustingId(item.id);
                            setAdjustValue(String(item.stockQuantity));
                          }}
                          className="text-xs font-semibold text-[#1554D1] hover:underline"
                        >
                          Adjust Count
                        </button>
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

