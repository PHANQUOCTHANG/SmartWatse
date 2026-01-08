import { Navigate, Outlet } from "react-router-dom";
// import { useAppSelector } from "@/store/store"; // nếu có auth sau

export default function ProtectedRoute({
  roles,
}: {
  roles?: string[];
}) {
  const isAuthenticated = true; // TODO: thay bằng auth thật

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
