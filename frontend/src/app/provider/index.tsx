// src/app/providers.tsx
import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/routes/route";
import { BrandLoader } from "@/components/ui/SmartWastLoadingEffects";
import { AppProviders } from "@/app/provider/appProvider";

export const AppWithRouter = () => (
  <AppProviders>
    <Suspense fallback={<BrandLoader fullscreen text="Đang tải ứng dụng..." />}>
      <RouterProvider router={router} />
    </Suspense>
  </AppProviders>
);
