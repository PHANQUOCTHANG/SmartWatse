import { createBrowserRouter } from "react-router-dom";

import { NotFoundPage } from "@/pages";
import { RootLayout } from "@/layouts";
import ManagerLayout from "@/layouts/manager/ManagerLayout";
import  MapMonitorPage  from "@/pages/manager/MapMonitorPage";
import ManagerSchedulePage from "@/features/schedule/pages/ManagerSchedulePage";
import TaskAssignmentPage from './../../features/task-assignment/pages/TaskAssignmentPage';
import ManagerFeedbackPage from "@/features/feedback/pages/ManagerFeedbackPage";
import ManagerReportsPage from "@/features/reports/pages/ManagerReportsPage";

export const router = createBrowserRouter([
  {
    // 🔥 QUAN TRỌNG: RootLayout bao trùm toàn bộ ứng dụng
    // Nó không có path (pathless route), nhiệm vụ chỉ là chạy logic Init Auth
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

      //     // Bung các route feature
      //     ...playlistRoutes,
      //     ...artistRoutes,
      //     ...albumRoutes,

      //     // Protected Routes
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

      // // ===================================================
      // // 3. NHÓM ADMIN PORTAL
      // // ===================================================
      // {
      //   path: ADMIN_PATHS.ADMIN,
      //   element: <ProtectedRoute />,
      //   children: [
      //     {
      //       element: <AdminLayout />,
      //       children: [
      //         { index: true, element: <DashboardPage /> },
      //         {
      //           path: ADMIN_PATHS.USERS,
      //           element: <UserPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.SONGS,
      //           element: <SongPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.ARTISTS,
      //           element: <ArtistManagementPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.ALBUMS,
      //           element: <AlbumManagementPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.ANALYTICS,
      //           element: <AnalyticPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.GENRES,
      //           element: <GenrePage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.SETTINGS,
      //           element: <SettingPage />,
      //         },
      //         {
      //           path: ADMIN_PATHS.PLAYLISTS,
      //           element: <PlaylistManagementPage />,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        path: "/manager",
        element: <ManagerLayout />,
        children: [
          {
            path: "map",
            element: <MapMonitorPage />,
          },
          {
            path: "schedule",
            element: <ManagerSchedulePage />,
          },
          {
            path: "tasks",
            element: <TaskAssignmentPage />,
          },
          {
            path: "/manager/feedback",
            element: <ManagerFeedbackPage />,
          },
          {
            path: "reports",
            element: <ManagerReportsPage />,
          }
        ],
      },
      // ===================================================
      // 4. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
