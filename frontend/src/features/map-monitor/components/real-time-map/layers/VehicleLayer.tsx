import React, { memo, useEffect, useRef } from "react";
import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { IVehicle, VehicleStatus } from "@/features/vehicles/types";
import { createVehicleIcon } from "@/features/map-monitor/utils/mapIcons";
import { VehiclePopupCard } from "@/features/vehicles/components/VehiclePopupCard";
import L from "leaflet";

// --- 1. SUB-COMPONENT: Xử lý riêng từng xe để tối ưu re-render ---
interface SingleMarkerProps {
  vehicle: IVehicle;
  isSelected?: boolean;
  onSelect?: (vehicle: IVehicle) => void;
  onViewRoute?: (vehicle: IVehicle) => void;
  onDetails?: (vehicle: IVehicle) => void;
}

// Dùng memo để chỉ render lại khi props của xe này thay đổi
const VehicleMarker = memo(
  ({
    vehicle,
    isSelected,
    onSelect,
    onViewRoute,
    onDetails,
  }: SingleMarkerProps) => {
    const markerRef = useRef<L.Marker>(null);
    const map = useMap();

    // Tự động mở Popup và bay tới khi xe được chọn (Selected)
    useEffect(() => {
      if (isSelected && markerRef.current) {
        markerRef.current.openPopup();
        // Option: Fly to vehicle
        map.flyTo([vehicle.coordinates.lat, vehicle.coordinates.lng], 16);
      }
    }, [isSelected, vehicle.coordinates]);

    // 1. Heading & Icon
    const heading = vehicle.coordinates?.heading || 0;

    // 2. Z-Index Strategy:
    // - Xe được chọn: Cao nhất (2000)
    // - Xe đang chạy: Cao (1000)
    // - Xe dừng: Thấp (500)
    const zIndex = isSelected
      ? 2000
      : vehicle.status === VehicleStatus.IN_USE
        ? 1000
        : 500;

    return (
      <Marker
        ref={markerRef}
        position={[vehicle.coordinates.lat, vehicle.coordinates.lng]}
        icon={createVehicleIcon(vehicle.type, vehicle.status, heading)}
        zIndexOffset={zIndex}
        eventHandlers={{
          // Xử lý click vào Marker (để chọn xe, vẽ đường, v.v.)
          click: (e) => {
            // Ngăn sự kiện nổi bọt nếu cần
            if (onSelect) onSelect(vehicle);
          },
        }}
      >
        {/* Tooltip: Luôn hiện nếu đang được chọn, hoặc hover */}
        <Tooltip
          direction="top"
          offset={[0, -20]}
          opacity={1}
          permanent={isSelected} // Luôn hiện tên nếu đang focus
          className="font-bold text-xs bg-slate-900 text-white border-0 px-2 py-1 rounded shadow-lg z-[2000]"
        >
          {vehicle.plateNumber}
        </Tooltip>

        <Popup
          offset={[0, -10]}
          minWidth={320}
          maxWidth={320}
          closeButton={false}
          className="custom-popup-clean" // Thêm class để style lại popup nếu cần
        >
          <VehiclePopupCard
            data={vehicle}
            onViewRoute={() => onViewRoute?.(vehicle)}
            onDetails={() => onDetails?.(vehicle)}
          />
        </Popup>
      </Marker>
    );
  },
  // Custom comparision function (Optional): Chỉ render lại khi toạ độ hoặc trạng thái đổi
  (prev, next) => {
    return (
      prev.vehicle.id === next.vehicle.id &&
      prev.vehicle.coordinates.lat === next.vehicle.coordinates.lat &&
      prev.vehicle.coordinates.lng === next.vehicle.coordinates.lng &&
      prev.vehicle.coordinates.heading === next.vehicle.coordinates.heading &&
      prev.vehicle.status === next.vehicle.status &&
      prev.isSelected === next.isSelected
    );
  },
);

// --- 2. MAIN COMPONENT ---
interface LayerProps {
  data: IVehicle[];
  selectedVehicleId?: string | null; // ID của xe đang được focus
  onSelect?: (vehicle: IVehicle) => void; // Sự kiện click vào marker
  onViewRoute?: (vehicle: IVehicle) => void;
  onDetails?: (vehicle: IVehicle) => void;
}

const VehicleLayer: React.FC<LayerProps> = ({
  data,
  selectedVehicleId,
  onSelect,
  onViewRoute,
  onDetails,
}) => {
  return (
    <>
      {data.map((vehicle) => (
        <VehicleMarker
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={vehicle.id === selectedVehicleId}
          onSelect={onSelect}
          onViewRoute={onViewRoute}
          onDetails={onDetails}
        />
      ))}
    </>
  );
};

export default memo(VehicleLayer);
