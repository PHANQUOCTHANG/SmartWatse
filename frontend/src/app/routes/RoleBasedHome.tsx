import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router-dom";

export const RoleBasedHome = () => {
  const { user, isAuthChecking } = useAppSelector((state) => state.auth);

  // 1. Chưa đăng nhập -> Về Login (Hoặc LandingPage nếu có)
  if (!user) {
    return <Navigate to="/login" replace />;
    // return <LandingPage />; // Nếu bạn có trang giới thiệu
  }

  // 2. Đã đăng nhập -> Check quyền để điều hướng
  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "MANAGER":
      return <Navigate to="/manager/map-monitor" replace />;

    case "STAFF":
      return <Navigate to="/staff/tasks" replace />;

    case "CITIZEN":
    default:
      // Citizen thì ở lại hiển thị trang chủ (Dashboard người dân)
      return <CitizenHomePage />;
  }
};

// Placeholder cho Citizen Home nếu chưa có
const CitizenHomePage = () => (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold text-primary">Xin chào cư dân!</h1>
    <p>Chào mừng bạn đến với hệ thống SmartWaste.</p>
  </div>
);
