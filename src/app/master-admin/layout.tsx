import { Suspense } from "react";
import { MasterAdminSidebar } from "@/components/admin/MasterAdminSidebar";

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col md:flex-row text-slate-800">
      <Suspense fallback={<div className="w-full md:w-68 bg-[#0F172A] h-16 md:h-screen" />}>
        <MasterAdminSidebar />
      </Suspense>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
