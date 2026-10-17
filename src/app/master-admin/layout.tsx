import { Suspense } from "react";
import { MasterAdminSidebar } from "@/components/admin/MasterAdminSidebar";

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060713] text-slate-100 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      <Suspense fallback={<div className="w-full md:w-72 bg-[#09061A] h-16 md:h-screen border-r border-purple-900/30" />}>
        <MasterAdminSidebar />
      </Suspense>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#060713]">
        {children}
      </main>
    </div>
  );
}
