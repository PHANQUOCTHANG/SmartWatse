import { Outlet } from "react-router-dom";
import ManagerHeader from "./ManagerHeader";
import ManagerSidebar from "./ManagerSidebar";

export default function ManagerLayout() {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <ManagerHeader />

        {/* Page content (SCROLL Ở ĐÂY) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
