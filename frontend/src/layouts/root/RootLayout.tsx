// src/layouts/root/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { useInitAuth } from "@/features/auth";
import { AuthLoader } from "@/components/ui/SmartWastLoadingEffects";

const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  if (isAuthChecking) return <AuthLoader fullscreen text="Đang xác thực..." />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
