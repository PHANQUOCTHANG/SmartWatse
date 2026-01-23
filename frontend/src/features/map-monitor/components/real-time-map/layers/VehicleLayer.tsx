import React, { memo } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { IVehicle, VehicleStatus } from "@/features/vehicles/types";
import { createVehicleIcon } from "@/features/map-monitor/utils/mapIcons";
import { VehiclePopupCard } from "@/features/vehicles/components/VehiclePopupCard";

interface Props {
  data: IVehicle[];
  /** Sự kiện khi user bấm "Xem lộ trình" trên Card */
  onViewRoute?: (vehicle: IVehicle) => void;
  /** Sự kiện khi user bấm nút "..." (Chi tiết) trên Card */
  onDetails?: (vehicle: IVehicle) => void;
}

const VehicleLayer: React.FC<Props> = ({ data, onViewRoute, onDetails }) => {
  return (
    <>
      {data.map((vehicle) => {
        // 1. Heading: Hướng xoay của xe
        const heading = vehicle.coordinates?.heading || 0;

        // 2. Z-Index: Xe đang chạy (IN_USE) nổi lên trên xe đang dừng
        const zIndex = vehicle.status === VehicleStatus.IN_USE ? 1000 : 500;

        return (
          <Marker
            key={vehicle.id}
            position={[vehicle.coordinates.lat, vehicle.coordinates.lng]}
            // Tạo Icon với hướng xoay
            icon={createVehicleIcon(vehicle.type, vehicle.status, heading)}
            zIndexOffset={zIndex}
          >
            {/* Tooltip: Hover vào thấy biển số ngay (UX tốt) */}
            <Tooltip
              direction="top"
              offset={[0, -20]}
              opacity={1}
              className="font-bold text-xs bg-slate-800 text-white border-0 px-2 py-1 rounded shadow-lg"
            >
              {vehicle.plateNumber}
            </Tooltip>

            {/* Popup: Chứa Card Component */}
            <Popup
              // offset: điều chỉnh vị trí popup sao cho không che mất xe
              offset={[0, -10]}
              // minWidth: đảm bảo card không bị bóp méo
              minWidth={320}
              maxWidth={320}
              // closeButton: false để dùng giao diện sạch (đã ẩn bằng CSS ở trên nhưng khai báo thêm cho chắc)
              closeButton={false}
            >
              <VehiclePopupCard
                data={vehicle}
                onViewRoute={() => {
                  // Đóng popup trước khi chuyển cảnh (nếu cần)
                  // map.closePopup();
                  if (onViewRoute) onViewRoute(vehicle);
                }}
                onDetails={() => {
                  if (onDetails) onDetails(vehicle);
                }}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

// Sử dụng memo để tránh render lại toàn bộ Layer khi map di chuyển mà data xe không đổi
export default memo(VehicleLayer, (prevProps, nextProps) => {
  // Custom comparision nếu cần tối ưu sâu hơn,
  // hiện tại so sánh nông (shallow compare) mảng data là đủ tốt.
  return prevProps.data === nextProps.data;
});
