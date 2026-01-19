import { createBrowserRouter, Navigate } from "react-router-dom";

// 1. Core Imports
import { NotFoundPage } from "@/pages";
import { RootLayout } from "@/layouts";
import ClientLayout from "@/layouts/client/ClientLayout";

// 2. Auth & Route Guards
import { GuestRoute } from "@/app/routes/GuestRoute";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import { guestAuthRoutes } from "@/features/auth/routes";

// 3. Config Paths
import { MANAGER_PATHS, STAFF_PATHS, ADMIN_PATHS } from "@/config/paths";

// 4. Page Imports (Manager)
import MapMonitorPage from "@/pages/manager/MapMonitorPage";
import ManagerSchedulePage from "@/features/schedule/pages/ManagerSchedulePage";
import TaskAssignmentPage from "@/features/task-assignment/pages/TaskAssignmentPage";
import ManagerFeedbackPage from "@/features/feedback/pages/ManagerFeedbackPage";
import ManagerReportsPage from "@/features/reports/pages/ManagerReportsPage";

// 4b. Page Imports (Admin)

// 5. Page Imports (Staff)
import {
  StaffTaskListPage,
  StaffTaskDetailPage,
  StaffMapPage,
  StaffProfilePage,
} from "@/pages/staff";
import StaffTaskHistoryPage from "@/pages/staff/StaffTaskHistoryPage";
import { RoleBasedHome } from "@/app/routes/RoleBasedHome";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import AreasPage from "@/pages/admin/AreasPage";
import BinsPage from "@/pages/admin/BinsPage";
import CollectionPointsPage from "@/pages/admin/CollectionPointsPage";

// 6. Page Imports (Citizen/Public)
// import LandingPage from "@/pages/public/LandingPage";

export const router = createBrowserRouter([
  {
    // RootLayout: Chứa Context, Toast, Theme...
    element: <RootLayout />,
    children: [
      // ===================================================
      // 1. AUTH ROUTES (Login/Register)
      // ===================================================
      {
        element: <GuestRoute />,
        children: [...guestAuthRoutes],
      },

      // ===================================================
      // 2. MAIN APP ROUTES (All Roles share ClientLayout)
      // ===================================================
      {
        element: <ClientLayout />, // Tự động hiển thị Sidebar/BottomNav theo Role
        children: [
          // --- ROOT PATH ("/") ---
          // Xử lý điều hướng thông minh khi user vào trang chủ
          {
            path: "/",
            element: <RoleBasedHome />, // <--- FIX: Tránh trang trắng
          },

          // --- A. MANAGER ROUTES ---
          {
            path: "manager",
            element: <ProtectedRoute roles={["MANAGER", "ADMIN"]} />,
            children: [
              {
                index: true,
                element: <Navigate to={MANAGER_PATHS.MAP_MONITOR} replace />,
              },
              { path: MANAGER_PATHS.MAP_MONITOR, element: <MapMonitorPage /> },
              {
                path: MANAGER_PATHS.SCHEDULE,
                element: <ManagerSchedulePage />,
              },
              { path: MANAGER_PATHS.TASKS, element: <TaskAssignmentPage /> },
              {
                path: MANAGER_PATHS.FEEDBACK,
                element: <ManagerFeedbackPage />,
              },
              { path: MANAGER_PATHS.REPORTS, element: <ManagerReportsPage /> },
            ],
          },
          // --- D. ADMIN ROUTES ---
          {
            path: "admin",
            element: <ProtectedRoute roles={["ADMIN"]} />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: ADMIN_PATHS.USERS, element: <UsersPage /> },
              { path: ADMIN_PATHS.AREAS, element: <AreasPage /> },
              { path: ADMIN_PATHS.BINS, element: <BinsPage /> },
              {
                path: ADMIN_PATHS.COLLECTION_POINTS,
                element: <CollectionPointsPage />,
              },
            ],
          },

          // --- B. STAFF ROUTES ---
          {
            path: "staff",
            element: <ProtectedRoute roles={["STAFF"]} />,
            children: [
              {
                index: true,
                element: <Navigate to={STAFF_PATHS.TASKS} replace />,
              },
              { path: STAFF_PATHS.TASKS, element: <StaffTaskListPage /> },
              {
                path: `${STAFF_PATHS.TASKS}/:taskId`,
                element: <StaffTaskDetailPage />,
              }, // Fix cú pháp params
              { path: STAFF_PATHS.MY_ROUTE, element: <StaffMapPage /> },
              { path: STAFF_PATHS.HISTORY, element: <StaffTaskHistoryPage /> },
              { path: STAFF_PATHS.PROFILE, element: <StaffProfilePage /> },
            ],
          },

          // --- C. CITIZEN ROUTES ---
          // Các route công khai hoặc dành cho người dân
          // { path: "map-lookup", element: <MapLookupPage /> },
        ],
      },

      // ===================================================
      // 3. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
