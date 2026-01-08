// src/layouts/root/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { useInitAuth } from "@/features/auth";

const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  // ⏳ Đang check auth → show loading (hoặc null)
  if (isAuthChecking) {
    return null;
    // hoặc:
    // return <div>Loading...</div>;
    // hoặc loader sau này
  }

  // ✅ AUTH CHECK XONG → LUÔN render Outlet
  return (
    <>
      <Outlet />
      {/* Global components đặt ở đây (toast, modal, v.v.) */}
    </>
  );
};

export default RootLayout;
