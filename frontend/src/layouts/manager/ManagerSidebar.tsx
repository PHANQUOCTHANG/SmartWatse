import { NavLink } from "react-router-dom";
import { managerRoutes } from "@/config/managerRoutes";
import { Settings, LogOut, Trash2, Recycle } from "lucide-react";

export default function ManagerSidebar() {
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <NavLink
        to="/manager/map"
        className="flex items-center gap-3 px-4 py-4 border-b hover:bg-gray-50"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
          <Recycle size={20} />
        </div>

        <div>
          <div className="font-semibold text-gray-900 leading-tight">
            Smart Waste
          </div>
          <div className="text-xs text-gray-500">
            Manager Portal
          </div>
        </div>
      </NavLink>

      {/* Menu */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {managerRoutes.map((m) => {
          const Icon = m.icon;
          return (
            <NavLink
              key={m.path}
              to={m.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                 ${
                   isActive
                     ? "bg-blue-50 text-blue-600 font-medium"
                     : "text-gray-600 hover:bg-gray-50"
                 }`
              }
            >
              <Icon size={18} />
              {m.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-2 space-y-1">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
          <Settings size={18} />
          Cài đặt
        </button>
        <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50 rounded-lg">
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
