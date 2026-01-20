import { createBrowserRouter, Navigate } from "react-router-dom";

// 1. Core Imports
import { NotFoundPage } from "@/pages";
import { RootLayout } from "@/layouts";
import ClientLayout from "@/layouts/client/ClientLayout";

// 2. Auth & Route Guards
import { GuestRoute } from "@/app/routes/GuestRoute";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import { guestAuthRoutes, protectedAuthRoutes } from "@/features/auth/routes";

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
import { CitizenLayout } from "@/layouts/citizen";
import {
  CitizenSchedulePage,
  CitizenHomePage,
  CitizenReportPage,
  CitizenReportDetailPage,
  CitizenReportCreatePage,
  CitizenNotificationPage,
} from "@/pages/citizen";
import { RoleBasedHome } from "@/app/routes/RoleBasedHome";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UsersPage from "@/pages/admin/UserManagementPage";
import BinsPage from "@/pages/admin/BinsPage";
import CollectionPointsPage from "@/pages/admin/CollectionPointsPage";
import AreaManagementPage from "@/pages/admin/AreaManagementPage";
import VehicleManagementPage from "@/pages/admin/VehicleManagementPage";

// 6. Page Imports (Citizen/Public)
// import LandingPage from "@/pages/public/LandingPage";

export const router = createBrowserRouter([
  {
    // RootLayout: Chứa Context, Toast, Theme...
    element: <RootLayout />,
    children: [
      // ===================================================
      // 1. NHÓM AUTH (Login/Register)
      // ===================================================
      // {
      //   element: <GuestRoute />, // <--- Bọc ở đây
      //   children: [
      //     ...guestAuthRoutes, // Login, Register
      //   ],
      // },

      // ===================================================
      // 2. NHÓM CLIENT (USER APP)
      // ===================================================
      // {
      //   path: CLIENT_PATHS.CLIENT,
      //   element: <ClientLayout />,
      //   children: [
      //     { index: true, element: <HomePage /> },
      //     { path: CLIENT_PATHS.BROWSE, element: <BrowsePage /> },
      //     { path: CLIENT_PATHS.SEARCH, element: <SearchPage /> },
      //     ...playlistRoutes,
      //     ...artistRoutes,
      //     ...albumRoutes,
      //     {
      //       element: <ProtectedRoute />,
      //       children: [
      //         { path: CLIENT_PATHS.PROFILE, element: <ProfilePage /> },
      //         {
      //           path: CLIENT_PATHS.CLAIM_PROFILE,
      //           element: <ClaimProfilePage />,
      //         },
      //         { path: CLIENT_PATHS.SETTINGS, element: <SettingsPage /> },
      //         ...protectedAuthRoutes,
      //       ],
      //     },
      //   ],
      // },

      // ===================================================
      // 3. NHÓM CITIZEN PORTAL  🔥🔥🔥 (THÊM MỚI)
      // ===================================================
      {
        element: <ProtectedRoute roles={["CITIZEN"]} />,
        children: [
          {
            path: "/citizen",
            element: <CitizenLayout />,
            children: [
              {
                index: true,
                element: <CitizenHomePage />,
              },
              {
                path: "home",
                element: <CitizenHomePage />,
              },
              {
                path: "schedule",
                element: <CitizenSchedulePage />,
              },
              {
                path: "report/*",
                children: [
                  {
                    index: true,
                    element: <CitizenReportPage />,
                  },
                  {
                    path: "new",
                    element: <CitizenReportCreatePage />,
                  },
                  {
                    path: ":id",
                    element: <CitizenReportDetailPage />,
                  },
                ],
              },
              {
                path: "notifications",
                element: <CitizenNotificationPage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 4. NHÓM STAFF PORTAL
      // 1. AUTH ROUTES (Login/Register)
      // ===================================================
      {
        element: <GuestRoute />,
        children: [...guestAuthRoutes],
      },
      {
        element: <ProtectedRoute />,
        children: [...protectedAuthRoutes],
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
            element: <ProtectedRoute />, // <--- FIX: Tránh trang trắng
            children: [
              {
                index: true,
                element: <RoleBasedHome />,
              },
            ],
          },

          // --- A. MANAGER ROUTES ---
          {
            path: "manager",
            element: <ProtectedRoute requiredRole={"MANAGER"} />,
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
            element: <ProtectedRoute requiredRole={"ADMIN"} />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: ADMIN_PATHS.USERS, element: <UsersPage /> },
              { path: ADMIN_PATHS.AREAS, element: <AreaManagementPage /> },
              { path: ADMIN_PATHS.BINS, element: <BinsPage /> },
              {
                path: ADMIN_PATHS.VEHICLES,
                element: <VehicleManagementPage />,
              },
              {
                path: ADMIN_PATHS.COLLECTION_POINTS,
                element: <CollectionPointsPage />,
              },
            ],
          },

          // --- B. STAFF ROUTES ---
          {
            path: "staff",
            element: <ProtectedRoute requiredRole={"STAFF"} />,
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
      // 5. ADMIN PORTAL
      // ===================================================
      // {
      //   path: ADMIN_PATHS.ADMIN,
      //   element: <ProtectedRoute />,
      //   children: [
      //     {
      //       element: <AdminLayout />,
      //       children: [
      //         { path: ADMIN_PATHS.USERS, element: <UserPage /> },
      //         { path: ADMIN_PATHS.SONGS, element: <SongPage /> },
      //         { path: ADMIN_PATHS.ARTISTS, element: <ArtistManagementPage /> },
      //         { path: ADMIN_PATHS.ALBUMS, element: <AlbumManagementPage /> },
      //         { path: ADMIN_PATHS.ANALYTICS, element: <AnalyticPage /> },
      //         { path: ADMIN_PATHS.GENRES, element: <GenrePage /> },
      //         { path: ADMIN_PATHS.SETTINGS, element: <SettingPage /> },
      //         { path: ADMIN_PATHS.PLAYLISTS, element: <PlaylistManagementPage /> },
      //       ],
      //     },
      //   ],
      // },

      // ===================================================
      // 6. 404 NOT FOUND
      // 3. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
