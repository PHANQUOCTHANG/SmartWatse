// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { useInitAuth } from "@/features/auth";

const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  if (isAuthChecking)
    // return <PulseLoader fullscreen text="Đang tải dữ liệu..." />;

    return (
      <>
        <Outlet />
        {/* Player luôn nằm đè lên tất cả (position fixed trong component) */}
      </>
    );
};

export default RootLayout;
