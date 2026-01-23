import React, { useCallback } from "react";
import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { ICollectionPoint } from "@/features/collection-points/types";
import { createCollectionPointIcon } from "@/features/map-monitor/utils/mapIcons";
import { CollectionPointPopupCard } from "@/features/collection-points/components/CollectionPointPopupCard";

interface Props {
  data: ICollectionPoint[];
  onEdit?: (point: ICollectionPoint) => void; // 🔥 Action Sửa
  onViewSchedule?: (id: string) => void; // 🔥 Action Xem lịch
}

const CollectionPointLayer: React.FC<Props> = ({
  data,
  onEdit,
  onViewSchedule,
}) => {
  const map = useMap();

  // Xử lý khi click vào marker -> Zoom nhẹ vào đó
  const handleMarkerClick = useCallback(
    (lat: number, lng: number) => {
      map.flyTo([lat, lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    },
    [map],
  );

  return (
    <>
      {data.map((point) => {
        // Validate tọa độ
        if (!point.latitude || !point.longitude) return null;

        return (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            // Bạn có thể update hàm createCollectionPointIcon để nhận status và đổi màu
            icon={createCollectionPointIcon()}
            eventHandlers={{
              click: () => handleMarkerClick(point.latitude, point.longitude),
            }}
          >
            {/* Tooltip: Hover là thấy tên ngay */}
            <Tooltip direction="top" offset={[0, -40]} opacity={0.9}>
              <div className="text-center">
                <div className="font-bold text-sm text-purple-700">
                  {point.name}
                </div>
                <div className="text-[10px] text-gray-500">
                  {point.areaName}
                </div>
              </div>
            </Tooltip>

            <Popup
              minWidth={340}
              offset={[0, -35]}
              className="custom-popup-clean"
            >
              <CollectionPointPopupCard
                data={point}
                onEdit={() => onEdit?.(point)}
                onViewSchedule={() => onViewSchedule?.(point.id)}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default React.memo(CollectionPointLayer);
