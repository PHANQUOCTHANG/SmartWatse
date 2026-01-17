import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useTheme } from "next-themes"; // Nếu bạn chưa dùng theme toggle ở đây thì có thể comment
import { useAppSelector } from "@/store/store";
import {
  ADMIN_PATHS,
  MANAGER_PATHS,
  STAFF_PATHS,
  CITIZEN_PATHS,
} from "@/config/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Map as MapIcon, // Đổi tên để tránh trùng với Map constructor
  Users,
  FileWarning,
  Settings,
  Recycle,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  History,
  Home,
  PlusCircle,
  Bell,
  Trash2,
  Truck,
  BarChart3,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

// --- 1. MENU CONFIGURATIONS PER ROLE ---

const adminSidebarItems = [
  {
    title: "Tổng quan",
    items: [
      { label: "Dashboard", path: ADMIN_PATHS.ROOT, icon: LayoutDashboard },
      {
        label: "Thống kê & Báo cáo",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.ANALYTICS}`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Quản lý hệ thống",
    items: [
      {
        label: "Khu vực",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.AREAS}`,
        icon: MapIcon,
      },
      {
        label: "Thiết bị (Thùng rác)",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.BINS}`,
        icon: Trash2,
      },
      {
        label: "Phương tiện",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.VEHICLES}`,
        icon: Truck,
      },
      {
        label: "Người dùng",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.USERS}`,
        icon: Users,
      },
    ],
  },
  {
    title: "Cấu hình",
    items: [
      {
        label: "Cài đặt chung",
        path: `${ADMIN_PATHS.ROOT}/${ADMIN_PATHS.SETTINGS}`,
        icon: Settings,
      },
    ],
  },
];

const managerSidebarItems = [
  {
    title: "Vận hành",
    items: [
      {
        label: "Bản đồ giám sát",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.MAP_MONITOR}`,
        icon: MapIcon,
      },
      {
        label: "Lịch thu gom",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.SCHEDULE}`,
        icon: CalendarDays,
      },
      {
        label: "Nhiệm vụ thu gom",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.TASKS}`,
        icon: CalendarDays,
      },

      {
        label: "Phân công",
        path: `${MANAGER_PATHS.ROOT}/assignments`,
        icon: ListTodo,
      }, // Giả sử có path này
    ],
  },
  {
    title: "Sự cố & Phản ánh",
    items: [
      {
        label: "Cảnh báo thiết bị",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.ALERTS}`,
        icon: FileWarning,
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
        icon: Users,
      },
      {
        label: "Khối lượng rác",
        path: `${MANAGER_PATHS.ROOT}/${MANAGER_PATHS.REPORT_WASTE}`,
        icon: Trash2,
      },
    ],
  },
];

const staffSidebarItems = [
  {
    title: "Công việc",
    items: [
      {
        label: "Nhiệm vụ hôm nay",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.TASKS}`,
        icon: ListTodo,
      }, // Sửa lại path cho đúng với router
      {
        label: "Bản đồ lộ trình",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.MY_ROUTE}`,
        icon: MapIcon,
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
        icon: Users,
      },
    ],
  },
];

const citizenSidebarItems = [
  {
    title: "Dịch vụ",
    items: [
      { label: "Trang chủ", path: CITIZEN_PATHS.ROOT, icon: Home },
      {
        label: "Tra cứu điểm gom",
        path: `/${CITIZEN_PATHS.MAP_LOOKUP}`,
        icon: MapIcon,
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
      { label: "Cài đặt", path: `/${CITIZEN_PATHS.SETTINGS}`, icon: Settings },
    ],
  },
];

// --- 2. SIDEBAR COMPONENT ---

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
  // const { theme, setTheme } = useTheme();

  // Get User Role from Redux Store
  const { user } = useAppSelector((state) => state.auth);

  // Dynamic Menu based on Role
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

  // Helper function để check active state chính xác hơn
  const checkIsActive = (itemPath: string) => {
    if (
      itemPath === "/" ||
      itemPath === ADMIN_PATHS.ROOT ||
      itemPath === MANAGER_PATHS.ROOT ||
      itemPath === STAFF_PATHS.ROOT
    ) {
      // Với các root path, chỉ active khi pathname khớp hoàn toàn
      return location.pathname === itemPath;
    }
    // Với các sub-path, active khi pathname bắt đầu bằng itemPath
    return location.pathname.startsWith(itemPath);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-screen lg:static lg:z-auto",
        "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
        isSidebarOpen
          ? "w-64 translate-x-0 shadow-2xl lg:shadow-none"
          : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-[70px]" : "lg:w-64"
      )}
    >
      {/* --- HEADER: LOGO --- */}
      <div
        className={cn(
          "flex h-16 items-center shrink-0 border-b border-border/50",
          isCollapsed ? "justify-center" : "px-6"
        )}
      >
        <div
          className="flex items-center gap-3 overflow-hidden cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex size-8 shrink-0 items-center justify-center text-primary">
            <Recycle className="size-7" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
              SmartWaste
            </span>
          )}
        </div>
      </div>

      {/* --- MENU LIST --- */}
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {sidebarGroups.map((group, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              {!isCollapsed && group.title && (
                <h4 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 animate-in fade-in duration-300">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => {
                const isActive = checkIsActive(item.path);

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      // Trên mobile, đóng sidebar sau khi click
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Active Indicator Strip (Optional Design Choice) */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER: USER INFO --- */}
      <div className="border-t border-border/50 p-4 bg-card/50 shrink-0">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <Avatar className="size-9 border border-border">
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex flex-1 flex-col overflow-hidden transition-all">
              <span
                className="truncate text-sm font-semibold text-foreground"
                title={user?.fullName}
              >
                {user?.fullName || "Guest User"}
              </span>
              <span className="truncate text-xs text-muted-foreground capitalize">
                {user?.role?.toLowerCase() || "Guest"}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button (Desktop Only) */}
        <div className="mt-4 hidden lg:flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
