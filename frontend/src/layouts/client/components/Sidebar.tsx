import React, { use, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/store/store"; // Import Redux hook
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
  Map,
  Users,
  FileWarning,
  Settings,
  Recycle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ListTodo,
  History,
  Home,
  PlusCircle,
  Bell,
  Trash2,
  Truck,
  BarChart3,
} from "lucide-react";

// --- 1. MENU CONFIGURATIONS PER ROLE ---

const adminSidebarItems = [
  {
    title: "Overview",
    items: [
      { label: "Tổng quan", path: ADMIN_PATHS.ROOT, icon: LayoutDashboard },
      {
        label: "Thống kê",
        path: `${ADMIN_PATHS.ROOT}/analytics`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Khu vực", path: ADMIN_PATHS.AREAS, icon: Map },
      { label: "Thùng rác", path: ADMIN_PATHS.BINS, icon: Trash2 },
      { label: "Nhân viên", path: ADMIN_PATHS.USERS, icon: Users },
      {
        label: "Xe thu gom",
        path: `${ADMIN_PATHS.ROOT}/vehicles`,
        icon: Truck,
      },
    ],
  },
  {
    title: "System",
    items: [{ label: "Cài đặt", path: ADMIN_PATHS.SETTINGS, icon: Settings }],
  },
];

const managerSidebarItems = [
  {
    title: "Operation",
    items: [
      { label: "Tổng quan", path: MANAGER_PATHS.ROOT, icon: LayoutDashboard },
      { label: "Giám sát bản đồ", path: MANAGER_PATHS.MAP_MONITOR, icon: Map },
      { label: "Lịch thu gom", path: MANAGER_PATHS.TASKS, icon: ListTodo },
    ],
  },
  {
    title: "Issues",
    items: [
      {
        label: "Cảnh báo & Sự cố",
        path: MANAGER_PATHS.ALERTS,
        icon: FileWarning,
      },
      { label: "Báo cáo người dân", path: MANAGER_PATHS.REPORTS, icon: Users },
    ],
  },
  {
    title: "Report",
    items: [
      {
        label: "Hiệu suất nhân viên",
        path: MANAGER_PATHS.REPORT_STAFF,
        icon: BarChart3,
      },
      {
        label: "Lượng rác thải",
        path: MANAGER_PATHS.REPORT_WASTE,
        icon: Trash2,
      },
    ],
  },
];

const staffSidebarItems = [
  {
    title: "Work",
    items: [
      { label: "Nhiệm vụ hôm nay", path: STAFF_PATHS.ROOT, icon: ListTodo },
      {
        label: "Tuyến đường",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.MY_ROUTE}`,
        icon: Map,
      },
    ],
  },
  {
    title: "Personal",
    items: [
      {
        label: "Lịch sử công việc",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.HISTORY}`,
        icon: History,
      },
      {
        label: "Hồ sơ cá nhân",
        path: `${STAFF_PATHS.ROOT}/${STAFF_PATHS.PROFILE}`,
        icon: Users,
      },
    ],
  },
];

const citizenSidebarItems = [
  {
    title: "Service",
    items: [
      { label: "Trang chủ", path: CITIZEN_PATHS.ROOT, icon: Home },
      { label: "Tìm thùng rác", path: CITIZEN_PATHS.MAP_LOOKUP, icon: Map },
      {
        label: "Gửi phản ánh",
        path: CITIZEN_PATHS.REPORT_CREATE,
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Lịch sử phản ánh",
        path: CITIZEN_PATHS.MY_REPORTS,
        icon: History,
      },
      { label: "Thông báo", path: CITIZEN_PATHS.NOTIFICATIONS, icon: Bell },
      { label: "Cài đặt", path: CITIZEN_PATHS.SETTINGS, icon: Settings },
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
  const { theme, setTheme } = useTheme();

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
        return []; // Fallback for guest or unknown role
    }
  }, [user?.role]);

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
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center text-primary">
            <Recycle className="size-7" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground">
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
                <h4 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path));
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
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
              <span className="truncate text-sm font-semibold text-foreground">
                {user?.fullName || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground capitalize">
                {user?.role?.toLowerCase() || "Role"}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button (Desktop) */}
        <div className="mt-4 hidden lg:flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
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
