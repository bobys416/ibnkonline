import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col md:flex-row text-slate-800">
      <Suspense fallback={<div className="w-full md:w-64 bg-[#172033] h-16 md:h-screen" />}>
        <AdminSidebar />
      </Suspense>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
