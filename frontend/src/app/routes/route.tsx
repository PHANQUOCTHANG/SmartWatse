import { createBrowserRouter, Navigate } from "react-router-dom";
import { NotFoundPage } from "@/pages";
import { RootLayout } from "@/layouts";
import ClientLayout from "@/layouts/client/ClientLayout";
import { GuestRoute } from "@/app/routes/GuestRoute";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import { guestAuthRoutes, protectedAuthRoutes } from "@/features/auth/routes";
import {
  MANAGER_PATHS,
  STAFF_PATHS,
  ADMIN_PATHS,
  CITIZEN_PATHS,
} from "@/config/paths";
import { RoleBasedHome } from "@/app/routes/RoleBasedHome";

// Manager Pages
import {
  MapMonitorPage as ManagerMapMonitorPage,
  ManagerSchedulePage,
  TaskAssignmentPage,
  ManagerFeedbackPage,
  ManagerReportsPage,
} from "@/pages/manager";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UsersPage from "@/pages/admin/UserManagementPage";
import BinsPage from "@/pages/admin/BinsPage";
import AreaManagementPage from "@/pages/admin/AreaManagementPage";
import VehicleManagementPage from "@/pages/admin/VehicleManagementPage";

// Staff Pages
import { StaffMapPage, StaffProfilePage } from "@/pages/staff";
import StaffTaskHistoryPage from "@/pages/staff/StaffTaskHistoryPage";
import CollectionPointManagementPage from "@/pages/admin/CollectionPointManagementPage";
import MapMonitorPage from "@/pages/admin/MapMonitor";
import StaffCollectionTaskPage from "@/pages/staff/StaffCollectionTaskPage";
import StaffCollectionTaskDetailPage from "@/pages/staff/StaffCollectionTaskDetailPage";
import UnifiedMapPage from "@/features/map-monitor/components/real-time-map/UnifiedMapPage";

// Citizen Pages
import {
  CitizenHomePage,
  CitizenReportCreatePage,
  CitizenReportPage,
  CitizenReportDetailPage,
  CitizenSchedulePage,
  CitizenNotificationPage,
} from "@/pages/citizen";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth Routes
      {
        element: <GuestRoute />,
        children: [...guestAuthRoutes],
      },
      {
        element: <ProtectedRoute />,
        children: [...protectedAuthRoutes],
      },

      // Main App Routes
      {
        element: <ClientLayout />,
        children: [
          {
            path: "/",
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <RoleBasedHome />,
              },
            ],
          },

          // Manager Routes
          {
            path: "manager",
            element: <ProtectedRoute requiredRole={"MANAGER"} />,
            children: [
              {
                index: true,
                element: <Navigate to={MANAGER_PATHS.MAP_MONITOR} replace />,
              },
              {
                path: MANAGER_PATHS.MAP_MONITOR,
                element: <UnifiedMapPage />,
              },
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

          // Admin Routes
          {
            path: "admin",
            element: <ProtectedRoute requiredRole={"ADMIN"} />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: ADMIN_PATHS.USERS, element: <UsersPage /> },
              { path: ADMIN_PATHS.AREAS, element: <AreaManagementPage /> },
              { path: ADMIN_PATHS.MAP_MONITOR, element: <UnifiedMapPage /> },
              { path: ADMIN_PATHS.BINS, element: <BinsPage /> },
              {
                path: ADMIN_PATHS.VEHICLES,
                element: <VehicleManagementPage />,
              },
              {
                path: ADMIN_PATHS.COLLECTION_POINTS,
                element: <CollectionPointManagementPage />,
              },
            ],
          },

          // Staff Routes
          {
            path: "staff",
            element: <ProtectedRoute requiredRole={"STAFF"} />,
            children: [
              {
                index: true,
                element: <Navigate to={STAFF_PATHS.TASKS} replace />,
              },
              { path: STAFF_PATHS.TASKS, element: <StaffCollectionTaskPage /> },
              {
                path: `${STAFF_PATHS.TASKS}/:taskId`,
                element: <StaffCollectionTaskDetailPage />,
              },
              { path: STAFF_PATHS.MY_ROUTE, element: <UnifiedMapPage /> },
              { path: STAFF_PATHS.HISTORY, element: <StaffTaskHistoryPage /> },
              { path: STAFF_PATHS.PROFILE, element: <StaffProfilePage /> },
            ],
          },

          // Citizen Routes
          {
            path: CITIZEN_PATHS.ROOT,
            element: <ProtectedRoute requiredRole={"CITIZEN"} />,
            children: [
              {
                index: true,
                element: <CitizenHomePage />,
              },
              {
                path: CITIZEN_PATHS.REPORT_CREATE,
                element: <CitizenReportCreatePage />,
              },
              {
                path: CITIZEN_PATHS.SCHEDULE,
                element: <CitizenSchedulePage />,
              },

              {
                path: `${CITIZEN_PATHS.MY_REPORTS}`,
                element: <CitizenReportPage />,
              },
              {
                path: `${CITIZEN_PATHS.MY_REPORTS}/:reportId`,
                element: <CitizenReportDetailPage />,
              },
              {
                path: CITIZEN_PATHS.NOTIFICATIONS,
                element: <CitizenNotificationPage />,
              },
              {
                path: CITIZEN_PATHS.MAP_LOOKUP,
                element: <UnifiedMapPage />,
              },
            ],
          },
        ],
      },

      // 404 Not Found
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
