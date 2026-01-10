import { createBrowserRouter } from "react-router-dom";

import { NotFoundPage } from "@/pages";
import { RootLayout } from "@/layouts";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import { StaffLayout } from "@/layouts/staff";
import { StaffTaskListPage } from "@/pages/staff";
import { StaffTaskDetailPage } from "@/pages/staff";
import { StaffMapPage } from "@/pages/staff";
import { StaffProfilePage } from "@/pages/staff";
import StaffTaskHistoryPage from "@/pages/staff/StaffTaskHistoryPage";
import { CitizenLayout } from "@/layouts/citizen";
import {
  CitizenSchedulePage,
  CitizenHomePage,
  CitizenReportPage,
  CitizenReportDetailPage,
} from "@/pages/citizen";

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
                    path: ":id",
                    element: <CitizenReportDetailPage />,
                  },
                ],
              },
              {
                path: "notifications",
                element: <CitizenSchedulePage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 4. NHÓM STAFF PORTAL
      // ===================================================
      {
        path: "/staff",
        element: <ProtectedRoute roles={["STAFF"]} />,
        children: [
          {
            element: <StaffLayout />,
            children: [
              {
                path: "tasks",
                element: <StaffTaskListPage />,
              },
              {
                path: "tasks/:taskId",
                element: <StaffTaskDetailPage />,
              },
              {
                path: "map",
                element: <StaffMapPage />,
              },
              {
                path: "profile",
                element: <StaffProfilePage />,
              },
              {
                path: "history",
                element: <StaffTaskHistoryPage />,
              },
            ],
          },
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
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
