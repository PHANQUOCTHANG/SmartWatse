import React, { memo, useRef } from "react";
import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { ICollectionPoint } from "@/features/collection-points/types";
import { createCollectionPointIcon } from "@/features/map-monitor/utils/mapIcons";
import { CollectionPointPopupCard } from "@/features/collection-points/components/CollectionPointPopupCard";

// --- 1. SUB-COMPONENT: PointMarker (Tối ưu Re-render) ---
interface PointMarkerProps {
  point: ICollectionPoint;
  onEdit?: (point: ICollectionPoint) => void;
  onViewSchedule?: (id: string) => void;
}

// Dùng Memo để marker không render lại nếu props không đổi
const PointMarker = memo(
  ({ point, onEdit, onViewSchedule }: PointMarkerProps) => {
    const map = useMap();
    const markerRef = useRef<L.Marker>(null);

    // Validate tọa độ chặt chẽ
    if (!point.latitude || !point.longitude) return null;

    const handleMarkerClick = () => {
      // FlyTo mượt mà khi click
      map.flyTo([point.latitude, point.longitude], 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    };

    return (
      <Marker
        ref={markerRef}
        position={[point.latitude, point.longitude]}
        icon={createCollectionPointIcon()} // Truyền status để đổi màu icon nếu cần
        eventHandlers={{
          click: handleMarkerClick,
        }}
      >
        <Tooltip
          direction="top"
          offset={[0, -36]}
          opacity={1}
          className="custom-map-tooltip" // Class CSS để style tooltip đẹp hơn
        >
          <div className="text-center font-sans">
            <div className="font-bold text-xs text-slate-800">{point.name}</div>
            <div className="text-[10px] text-slate-500">
              {point.address?.split(",")[0]}
            </div>
          </div>
        </Tooltip>

        <Popup
          minWidth={340}
          maxWidth={340}
          offset={[0, -30]}
          closeButton={false}
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
  },
  (prev, next) => {
    // Custom compare: Chỉ render lại khi data quan trọng thay đổi
    return (
      prev.point.id === next.point.id &&
      prev.point.status === next.point.status &&
      prev.point.latitude === next.point.latitude &&
      prev.point.longitude === next.point.longitude
    );
  },
);

// --- 2. MAIN COMPONENT: CollectionPointLayer ---
interface Props {
  data: ICollectionPoint[];
  onEdit?: (point: ICollectionPoint) => void;
  onViewSchedule?: (id: string) => void;
}

const CollectionPointLayer: React.FC<Props> = ({
  data,
  onEdit,
  onViewSchedule,
}) => {
  // Custom Icon cho Cluster (Nhóm)
  const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = "small";
    if (count > 10) size = "medium";
    if (count > 50) size = "large";

    // Trả về HTML string để Leaflet render
    // Sử dụng class Tailwind kết hợp custom CSS
    return L.divIcon({
      html: `<div class="cluster-inner"><span>${count}</span></div>`,
      className: `custom-marker-cluster cluster-${size}`,
      iconSize: L.point(40, 40, true),
    });
  };

  return (
    <MarkerClusterGroup
      chunkedLoading // Quan trọng: Load từng phần để không đơ trình duyệt nếu data > 1000 điểm
      iconCreateFunction={createClusterIcon} // Icon tùy chỉnh
      spiderfyOnMaxZoom={true} // Tách các điểm trùng nhau khi zoom max
      showCoverageOnHover={false} // Tắt vùng phủ màu xanh khi hover (đỡ rối)
      maxClusterRadius={60} // Bán kính gom nhóm (pixel)
    >
      {data.map((point) => (
        <PointMarker
          key={point.id}
          point={point}
          onEdit={onEdit}
          onViewSchedule={onViewSchedule}
        />
      ))}
    </MarkerClusterGroup>
  );
};

export default memo(CollectionPointLayer);
