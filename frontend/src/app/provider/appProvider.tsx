/**
 * @file providers.tsx
 * @description Wrapper Component chứa toàn bộ các Global Providers của ứng dụng.
 * @architecture
 * - ReduxProvider: State Management.
 * - PersistGate: Chặn render UI cho đến khi State được khôi phục từ LocalStorage (F5 không mất nhạc).
 * - QueryClientProvider: Server State (TanStack Query).
 * - SocketProvider: Realtime Connection.
 * - ThemeProvider: Dark/Light mode.
 */

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// --- Internal Modules ---
import { store } from "@/store/store";
import { queryClient } from "@/lib/queryClient";

// --- Components ---

import { SocketProvider } from "@/app/provider/SocketProvider";

// ============================================================================
// 1. APP PROVIDERS (Global Context Wrappers)
// ============================================================================

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {/* 2. Bọc ThemeProvider vào đây để quản lý Class HTML */}
        {/* <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> */}
        {children}

        {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}

        {/* 3. Cập nhật Toaster */}
        {/* Xóa dòng theme="dark" để nó tự ăn theo CSS class của hệ thống */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          // theme="system" // Nếu thư viện sonner bản mới hỗ trợ prop này thì có thể thêm, không thì để mặc định nó sẽ tự theo CSS
        />
        {/* </ThemeProvider> */}
      </SocketProvider>
    </QueryClientProvider>
  </ReduxProvider>
);
