"use client";

import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useState } from "react";

const CITIZEN_MENU = [
  { label: "Trang chủ", icon: "home", path: "/citizen/home" },
  { label: "Lịch thu gom", icon: "calendar_month", path: "/citizen/schedule" },
  { label: "Phản ánh", icon: "report_problem", path: "/citizen/report" },
  { label: "Thông báo", icon: "notifications", path: "/citizen/notifications" },
];

const ACCOUNT_MENU = [
  { label: "Hồ sơ cá nhân", icon: "person", path: "/citizen/profile" },
];

export default function CitizenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Map path to header title
  const getHeaderTitle = (pathname: string) => {
    if (pathname === "/citizen/home" || pathname === "/citizen") return "";
    if (pathname === "/citizen/schedule") return "Lịch thu gom rác";
    if (pathname === "/citizen/report") return "";
    if (pathname === "/citizen/notifications") return "Thông báo";
    if (pathname === "/citizen/profile") return "Hồ sơ cá nhân";
    if (pathname === "/citizen/settings") return "Cài đặt";
    return "Lịch thu gom rác";
  };

  const isHomePage =
    location.pathname === "/citizen/home" || location.pathname === "/citizen";
  const isReportPage = location.pathname === "/citizen/report";
  const isReportDetailPage =
    location.pathname.startsWith("/citizen/report/") &&
    location.pathname !== "/citizen/report";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={clsx(
          "fixed md:static inset-y-0 left-0 z-40",
          "w-64 bg-white border-r border-gray-100 flex flex-col shrink-0",
          "transition-transform duration-300 ease-out",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* LOGO */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">recycling</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Urban Waste</h1>
              <p className="text-xs text-gray-400">Cổng thông tin cư dân</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {CITIZEN_MENU.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-gray-500 hover:bg-gray-50"
                )
              }
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ACCOUNT SECTION */}
        <div className="px-3 py-3 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">
            TÀI KHOẢN
          </p>
          <nav className="space-y-1">
            {ACCOUNT_MENU.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-gray-500 hover:bg-gray-50"
                  )
                }
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PROFILE SECTION */}
        <div className="p-4 border-t border-gray-100">
          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
            <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              NA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">Nguyễn Văn A</p>
              <p className="text-[10px] text-gray-500">Cư dân - Quận 1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger Menu - Mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* REPORT DETAIL BACK BUTTON */}
            {isReportDetailPage && (
              <button
                onClick={() => navigate("/citizen/report")}
                className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            )}

            {/* HOME PAGE HEADER - Smart Header */}
            {isHomePage ? (
              <div className="flex items-center gap-4 w-full">
                {/* Greeting */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">
                    Xin chào,{" "}
                    <span className="font-bold text-gray-900">
                      Nguyễn Văn A
                    </span>
                  </p>
                </div>

                {/* Location Selector */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/40 transition cursor-pointer group">
                  <span className="material-symbols-outlined text-lg text-gray-600 group-hover:text-primary transition">
                    location_on
                  </span>
                  <select className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer">
                    <option>Quận 1</option>
                    <option>Quận 3</option>
                    <option>Quận 5</option>
                    <option>Quận 7</option>
                  </select>
                </div>
              </div>
            ) : !isReportPage && !isReportDetailPage ? (
              /* OTHER PAGES HEADER */
              <h2 className="text-lg md:text-xl font-bold">
                {getHeaderTitle(location.pathname)}
              </h2>
            ) : null}
          </div>

          {/* RIGHT SIDE - Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications - Only on non-home, non-report and non-report-detail pages */}
            {!isHomePage && !isReportPage && !isReportDetailPage && (
              <div className="hidden md:block relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  search
                </span>
                <input
                  className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm"
                  placeholder="Tìm khu vực khác..."
                />
              </div>
            )}

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition group">
              <span className="material-symbols-outlined group-hover:text-primary transition">
                notifications
              </span>
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
