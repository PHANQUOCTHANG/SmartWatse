import { Bell, ChevronDown, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { managerRoutes } from "@/config/managerRoutes";

export default function ManagerHeader() {
  const { pathname } = useLocation();

  // Tìm route hiện tại
  const currentRoute = managerRoutes.find((r) =>
    pathname.startsWith(r.path)
  );

  // Mặc định cho phép search, trừ khi show = false
  const showSearch = currentRoute?.search?.show !== false;

  // Placeholder mặc định
  const searchPlaceholder =
    currentRoute?.search?.placeholder || "Tìm kiếm...";

  return (
    <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
      {/* LEFT */}
      <div>
        <div className="text-sm text-gray-500">
          Trang chủ <span className="mx-1">›</span>
          <span className="text-blue-600">
            {currentRoute?.breadcrumb || "Dashboard"}
          </span>
        </div>

        <div className="text-lg font-semibold text-gray-900">
          {currentRoute?.title || "Trang quản lý"}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH (conditional) */}
        {showSearch && (
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-80 border rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* NOTIFICATION */}
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* USER */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/32"
            alt="User avatar"
            className="rounded-full w-8 h-8"
          />
          <span className="text-sm font-medium text-gray-700">
            Nguyễn Văn A
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}
