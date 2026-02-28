import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_PATHS,
  MANAGER_PATHS,
  STAFF_PATHS,
  CITIZEN_PATHS,
} from "@/config/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  MapPinned,
  Map,
  Users,
  User,
  Settings,
  Recycle,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  History,
  Home,
  PlusCircle,
  Bell,
  Truck,
  BarChart3,
  CalendarDays,
  MessageSquare,
  ClipboardList,
  UserCog,
  AlertTriangle,
  FileBarChart,
  Route,
  MapPin,
  Trash,
  BabyIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

/* =========================================================
   MENU CONFIG PER ROLE
========================================================= */

// ---------- ADMIN ----------
const adminSidebarItems = [
  {
    title: "Tổng quan",
    items: [
      {
        label: "Dashboard",
        path: ADMIN_PATHS.ROOT,
        icon: LayoutDashboard,
      },
      {
        label: "Bản đồ rác thải",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.MAP_MONITOR}`,
        icon: MapPinned,
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      {
        label: "Người dùng",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.USERS}`,
        icon: Users,
      },
      {
        label: "Khu vực",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.AREAS}`,
        icon: Map,
      },
      {
        label: "Điểm thu gom",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.COLLECTION_POINTS}`,
        icon: MapPin,
      },
      {
        label: "Thiết bị (Thùng rác)",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.BINS}`,
        icon: Trash,
      },
      {
        label: "Phương tiện",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.VEHICLES}`,
        icon: Truck,
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        label: "Thống kê & Báo cáo",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.ANALYTICS}`,
        icon: BarChart3,
      },
      {
        label: "Cài đặt chung",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.SETTINGS}`,
        icon: Settings,
      },
    ],
  },
];

// ---------- MANAGER ----------
const managerSidebarItems = [
  {
    title: "Vận hành",
    items: [
      {
        label: "Bản đồ giám sát",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.MAP_MONITOR}`,
        icon: MapPinned,
      },
      {
        label: "Lịch thu gom",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.SCHEDULE}`,
        icon: CalendarDays,
      },
      {
        label: "Nhiệm vụ thu gom",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.TASKS}`,
        icon: ClipboardList,
      },
      {
        label: "Phân công",
        path: `${MANAGER_PATHS.ROOT}/assignments`,
        icon: UserCog,
      },
    ],
  },
  {
    title: "Sự cố & Phản ánh",
    items: [
      {
        label: "Cảnh báo thiết bị",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.ALERTS}`,
        icon: AlertTriangle,
      },
      {
        label: "Phản ánh cư dân",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.FEEDBACK}`,
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Báo cáo",
    items: [
      {
        label: "Báo cáo tổng thể",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.REPORT}`,
        icon: FileBarChart,
      },
      {
        label: "Khối lượng rác",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.REPORT_WASTE}`,
        icon: BarChart3,
      },
    ],
  },
];

// ---------- STAFF ----------
const staffSidebarItems = [
  {
    title: "Công việc",
    items: [
      {
        label: "Nhiệm vụ hôm nay",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.TASKS}`,
        icon: ListTodo,
      },
      {
        label: "Bản đồ lộ trình",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.MY_ROUTE}`,
        icon: Route,
      },
    ],
  },
  {
    title: "Cá nhân",
    items: [
      {
        label: "Lịch sử công việc",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.HISTORY}`,
        icon: History,
      },
      {
        label: "Thông báo",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.NOTIFICATIONS}`,
        icon: Bell,
      },
      {
        label: "Hồ sơ",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.PROFILE}`,
        icon: User,
      },
    ],
  },
];

// ---------- CITIZEN ----------
const citizenSidebarItems = [
  {
    title: "Dịch vụ",
    items: [
      {
        label: "Trang chủ",
        path: CITIZEN_PATHS.ROOT,
        icon: Home,
      },
      {
        label: "Bản đồ",
        path: `/${CITIZEN_PATHS.MAP_LOOKUP}`,
        icon: MapPinned,
      },
      {
        label: "Tra cứu điểm gom",
        path: `/${CITIZEN_PATHS.SCHEDULE}`,
        icon: BabyIcon,
      },
      {
        label: "Gửi phản ánh",
        path: `/${CITIZEN_PATHS.REPORT_CREATE}`,
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      {
        label: "Lịch sử phản ánh",
        path: `/${CITIZEN_PATHS.MY_REPORTS}`,
        icon: History,
      },
      {
        label: "Thông báo",
        path: `/${CITIZEN_PATHS.NOTIFICATIONS}`,
        icon: Bell,
      },
      {
        label: "Cài đặt",
        path: `/${CITIZEN_PATHS.SETTINGS}`,
        icon: Settings,
      },
    ],
  },
];

/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const sidebarGroups = useMemo(() => {
    switch (user?.role) {
      case "ADMIN":
        return adminSidebarItems;
      case "MANAGER":
        return managerSidebarItems;
      case "STAFF":
        return staffSidebarItems;
      case "CITIZEN":
        return citizenSidebarItems;
      default:
        return [];
    }
  }, [user?.role]);

  const ROOT_PATHS = [
    ADMIN_PATHS.ROOT,
    MANAGER_PATHS.ROOT,
    STAFF_PATHS.ROOT,
    CITIZEN_PATHS.ROOT,
  ];

  const checkIsActive = (itemPath: string) => {
    const currentPath = location.pathname;

    // 1. Nếu là ROOT (Dashboard) → so sánh tuyệt đối
    if (ROOT_PATHS.includes(itemPath)) {
      return currentPath === itemPath;
    }

    // 2. Các route con → startsWith
    return currentPath.startsWith(itemPath);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-screen lg:static",
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        isSidebarOpen
          ? "w-64 translate-x-0"
          : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-[70px]" : "lg:w-64",
      )}
    >
      {/* HEADER */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/50",
          isCollapsed ? "justify-center" : "px-6",
        )}
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Recycle className="size-7 text-primary" />
          {!isCollapsed && (
            <span className="text-xl font-bold">SmartWaste</span>
          )}
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {sidebarGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => {
              const active = checkIsActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted",
                    isCollapsed && "justify-center",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="size-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="border-t border-border/50 p-4">
        <div className="mt-4 hidden lg:flex justify-end">
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
