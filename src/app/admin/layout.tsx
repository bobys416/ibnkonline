import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060713] text-slate-100 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      <Suspense fallback={<div className="w-full md:w-72 bg-[#0A071E] h-16 md:h-screen border-r border-purple-900/30" />}>
        <AdminSidebar />
      </Suspense>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#060713]">
        {children}
      </main>
    </div>
  );
}
