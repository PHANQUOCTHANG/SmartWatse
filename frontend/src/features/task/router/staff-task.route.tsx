import { RouteObject } from "react-router-dom";
import StaffLayout from "@/layouts/staff/StaffLayout";
import StaffTaskListPage from "@/pages/staff/StaffTaskListPage";
import StaffTaskDetailPage from "@/pages/staff/StaffTaskDetailPage";

export const staffTaskRoute: RouteObject = {
  path: "/staff",
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
  ],
};
