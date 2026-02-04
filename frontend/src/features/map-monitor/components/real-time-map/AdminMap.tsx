import React, { useEffect, useMemo } from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Hooks Store
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Layers
import BaseMapLayer from "./layers/BaseMapLayer";
import BinLayer from "./layers/BinLayer";
import VehicleLayer from "./layers/VehicleLayer";
import RouteLayer from "./layers/RouteLayer";
import AreaLayer from "./layers/AreaLayer";
import CollectionPointLayer from "./layers/CollectionPointLayer";

// Controls
import MapControls from "./MapControls";
import MapSearchBox from "./MapSearchBox";
import { MapLoader } from "@/components/ui/SmartWastLoadingEffects";

// Logic & Types
import { useMapSocket } from "@/features/map-monitor/hooks/useMapSocket";
import { fetchMapData, setRoute } from "@/features/map-monitor/slice/mapSlice";
import { IVehicle } from "@/features/vehicles/types";

const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172];

const AdminMap = () => {
  const dispatch = useAppDispatch();

  // 1. Kích hoạt Socket
  useMapSocket();

  // 2. Lấy Data từ Redux
  const { vehicles, bins, areas, points, layers, activeRoute, isLoading } =
    useAppSelector((state) => state.map);

  // 3. Fetch Data ban đầu
  useEffect(() => {
    dispatch(fetchMapData());
  }, [dispatch]);

  // 4. Optimize Data
  const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]);
  const binList = useMemo(() => Object.values(bins), [bins]);

  // 🔥 5. Hàm xử lý khi click vào xe
  const handleSelectVehicle = (vehicle: IVehicle) => {
    // Logic Demo: Tìm điểm tập kết đầu tiên làm điểm đến
    // (Thực tế bạn sẽ lấy điểm đến từ lộ trình nhiệm vụ của xe)
    let endPoint: [number, number] = [10.7721, 106.6983]; // Mặc định Chợ Bến Thành

    if (points && points.length > 0) {
      endPoint = [points[0].latitude, points[0].longitude];
    }

    // Dispatch action setRoute để kích hoạt RouteLayer
    dispatch(
      setRoute({
        start: [vehicle.coordinates.lat, vehicle.coordinates.lng],
        end: endPoint,
        vehicleId: vehicle.id,
      }),
    );
  };

  // Loading UI
  if (isLoading && areas.length === 0) {
    return <MapLoader text="Đang khởi tạo bản đồ số..." />;
  }
  console.log(areas, points, binList, vehicleList, activeRoute);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        zoomControl={false}
        className="h-full w-full bg-slate-900 z-0"
      >
        <BaseMapLayer />

        {/* --- Render Layers --- */}
        {layers.areas && <AreaLayer data={areas} />}

        {/* Điểm tập kết */}
        <CollectionPointLayer data={points} />

        {layers.bins && <BinLayer data={binList} />}

        {/* 🔥 Truyền hàm handleSelectVehicle vào VehicleLayer */}
        {layers.vehicles && (
          <VehicleLayer data={vehicleList} onSelect={handleSelectVehicle} />
        )}

        {/* 🔥 RouteLayer: Chỉ hiện khi activeRoute != null */}
        {activeRoute && (
          <RouteLayer start={activeRoute.start} end={activeRoute.end} />
        )}

        {/* --- Controls --- */}
        <MapSearchBox />
        <ZoomControl position="bottomright" />
        <div className="absolute top-4 left-4 z-[1000]">
          <MapControls />
        </div>
      </MapContainer>
    </div>
  );
};

export default AdminMap;
