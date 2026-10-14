"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Key, CheckCircle2, RefreshCw } from "lucide-react";

export default function MasterAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/master-admin/users");
      const json = await res.json();
      if (json.success && json.data) {
        setUsers(json.data.users);
        setAvailableRoles(json.data.availableRoles);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSaveRoles() {
    if (!selectedUser) return;
    try {
      const res = await fetch("/api/master-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          roles: editingRoles,
          reason: "Role assignments updated via Master Admin RBAC panel",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage("Role privileges updated successfully!");
        setTimeout(() => setActionMessage(""), 3000);
        setSelectedUser(null);
        loadUsers();
      } else {
        alert(json.error || "Failed to update roles.");
      }
    } catch {
      alert("Error updating user roles.");
    }
  }

  function toggleRole(role: string) {
    if (editingRoles.includes(role)) {
      setEditingRoles(editingRoles.filter((r) => r !== role));
    } else {
      setEditingRoles([...editingRoles, role]);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Privileged user provisioning, granular permission scopes, and separation of duties.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Operator / Email</th>
                  <th className="py-3 px-4">Assigned Roles</th>
                  <th className="py-3 px-4">Effective Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172033]">{u.fullName}</div>
                      <div className="text-slate-500 font-mono">{u.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r: string) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              r.includes("master") || r.includes("super")
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {r.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {u.permissions.length} granular grants
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setEditingRoles([...u.roles]);
                        }}
                        className="text-xs font-semibold text-[#1554D1] hover:underline"
                      >
                        Edit Roles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-[#172033]">
              Configure Roles: {selectedUser.fullName}
            </h3>
            <p className="text-xs text-slate-500">
              Granting or revoking privileges takes effect immediately across all sessions.
            </p>

            <div className="space-y-2 pt-2">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  <span className="font-mono font-bold text-slate-800">{role}</span>
                  <input
                    type="checkbox"
                    checked={editingRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="rounded text-[#1554D1]"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                className="px-4 py-2 text-xs font-bold bg-[#1554D1] text-white hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Save Role Grants
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

