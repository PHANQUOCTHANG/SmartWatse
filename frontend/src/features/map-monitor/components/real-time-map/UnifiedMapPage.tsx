// src/pages/UnifiedMapPage.tsx
import React from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Hooks
import { useAppSelector } from "@/store/hooks";
import { useMapSocket } from "@/features/map-monitor/hooks/useMapSocket";
import { useMapDataByRole } from "@/features/map-monitor/hooks/useMapDataByRole";

// Components
import { RoleMapWrapper } from "@/features/map-monitor/components/RoleMapWrapper";
import { MapLoader } from "@/components/ui/SmartWastLoadingEffects";
import BaseMapLayer from "@/features/map-monitor/components/real-time-map/layers/BaseMapLayer";
import MapSearchBox from "@/features/map-monitor/components/real-time-map/MapSearchBox";

const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172];

const UnifiedMapPage = () => {
  useMapSocket();
  useMapDataByRole();

  const { isLoading } = useAppSelector((state) => state.map);
  const { user } = useAppSelector((state) => state.auth);

  if (isLoading) return <MapLoader text="Đang tải dữ liệu bản đồ..." />;

  console.log("User Role:", user?.role);

  return (
    // 🔥 SỬA Ở ĐÂY:
    // Thay 'h-screen' bằng 'h-[calc(100vh-64px)]' (hoặc chiều cao header thực tế của bạn)
    // Nếu bạn không có header (full screen hoàn toàn), hãy giữ nguyên 'h-screen' và thêm 'overflow-hidden' vào body css.
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        zoomControl={false}
        className="h-full w-full bg-slate-900 z-0"
      >
        <BaseMapLayer />

        <RoleMapWrapper />

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <MapSearchBox />
        )}

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

export default UnifiedMapPage;
