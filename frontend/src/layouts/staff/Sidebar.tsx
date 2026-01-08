import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

type Props = {
  isMobile?: boolean;
  onClose?: () => void;
};

const MENU_ITEMS = [
  { id: "tasks", label: "Nhiệm vụ", icon: "assignment", path: "/staff/tasks" },
  { id: "map", label: "Bản đồ tuyến đường", icon: "map", path: "/staff/map" },
  { id: "history", label: "Lịch sử", icon: "history", path: "/staff/history" },
  {
    id: "profile",
    label: "Hồ sơ",
    icon: "account_circle",
    path: "/staff/profile",
  },
];

export default function Sidebar({ isMobile = false, onClose }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const rootClass = isMobile
    ? "w-[88%] max-w-xs h-full bg-white rounded-lg shadow-xl border border-gray-100 p-4"
    : "w-56 border-r border-gray-100 flex flex-col shrink-0 bg-white h-full";

  return (
    <aside className={rootClass}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-primary font-black text-lg tracking-tighter">
            SmartWaste
          </div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Staff
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-semibold text-sm",
                isActive
                  ? "bg-blue-50 text-primary shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <span
                className={clsx(
                  "material-symbols-outlined text-[20px]",
                  isActive && "fill-1"
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="size-9 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">
              Nguyễn Văn A
            </p>
            <p className="text-[8px] font-bold text-gray-400 uppercase">
              Nhân viên
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
