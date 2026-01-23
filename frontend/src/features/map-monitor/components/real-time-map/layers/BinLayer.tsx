import React, { useCallback } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

// Types & Utils
import { IBin } from "@/features/bin/types";
import { createBinIcon } from "@/features/map-monitor/utils/mapIcons";

// Components
import { BinPopupCard } from "@/features/bin/components/BinPopupCard";

interface Props {
  data: IBin[];
  onDispatch?: (id: string) => void; // Xử lý điều phối xe
  onEdit?: (bin: IBin) => void; // Xử lý mở modal sửa
}

const BinLayer: React.FC<Props> = ({ data, onDispatch, onEdit }) => {
  // 🔥 1. Custom Cluster Icon: Tạo icon gom nhóm đẹp mắt
  const createClusterCustomIcon = useCallback((cluster: any) => {
    const count = cluster.getChildCount();

    // Logic màu sắc: Nhóm nhỏ màu xanh, nhóm lớn màu cam/đỏ
    let sizeClass = "bg-green-500";
    if (count > 10) sizeClass = "bg-yellow-500";
    if (count > 50) sizeClass = "bg-orange-500";
    if (count > 100) sizeClass = "bg-red-500";

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 transform transition-transform hover:scale-110">
          <span class="absolute inline-flex h-full w-full rounded-full ${sizeClass} opacity-30 animate-ping"></span>
          <div class="relative flex items-center justify-center w-10 h-10 rounded-full ${sizeClass} shadow-lg border-2 border-white">
            <span class="text-white font-bold text-sm">${count}</span>
          </div>
        </div>
      `,
      className: "custom-marker-cluster",
      iconSize: L.point(40, 40, true),
    });
  }, []);

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon} // Sử dụng icon cluster custom
      maxClusterRadius={60} // Bán kính gom nhóm
      spiderfyOnMaxZoom={true} // Tách ra khi zoom hết cỡ
      showCoverageOnHover={false} // Tắt vùng phủ màu xanh mặc định khi hover
    >
      {data.map((bin) => {
        // 🔥 2. Xử lý tọa độ an toàn (GeoJSON vs Flat)
        // Ưu tiên GeoJSON [Lng, Lat] -> Leaflet [Lat, Lng]
        let lat = bin.latitude;
        let lng = bin.longitude;

        if (bin.location?.coordinates) {
          lng = bin.location.coordinates[0];
          lat = bin.location.coordinates[1];
        }

        // Nếu không có tọa độ hợp lệ thì bỏ qua
        if (!lat || !lng) return null;

        return (
          <Marker
            key={bin.id}
            position={[lat, lng]}
            // 🔥 3. Icon chuẩn Type & Status
            icon={createBinIcon(bin.binType || bin.type, bin.status)}
          >
            {/* Tooltip nhanh khi hover */}
            <Tooltip direction="top" offset={[0, -20]} opacity={0.8}>
              <span className="font-bold">{bin.code}</span>
              <span className="text-xs ml-1 text-gray-500">
                ({bin.currentLevel}%)
              </span>
            </Tooltip>

            <Popup minWidth={320} offset={[0, -10]}>
              <BinPopupCard
                data={bin}
                onDispatch={() => onDispatch?.(bin.id)}
                onEdit={() => onEdit?.(bin)} // Kích hoạt sửa
                onViewDetails={(id) => console.log("Detail", id)}
              />
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
};

export default React.memo(BinLayer);
