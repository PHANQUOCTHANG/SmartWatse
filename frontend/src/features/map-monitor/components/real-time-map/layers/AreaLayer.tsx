import React, { useMemo } from "react";
import { Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import { IArea, AreaType } from "@/features/area/types";
import { AreaPopupCard } from "@/features/area/components/AreaPopupCard";
import {
  swapLngLat,
  getAreaStyle,
} from "@/features/map-monitor/utils/mapIcons"; // Import hàm style mới
import L from "leaflet";

// --- COMPONENT CON: Xử lý riêng từng Polygon ---
interface AreaPolygonProps {
  area: IArea;
}

const AreaPolygon: React.FC<AreaPolygonProps> = ({ area }) => {
  const map = useMap();

  // 1. Tính toán tọa độ (Chỉ tính lại khi boundary thay đổi)
  const positions = useMemo(() => {
    try {
      if (!area.boundary || area.boundary.length === 0) return null;
      const swapped = swapLngLat(area.boundary);
      return swapped.length > 2 ? swapped : null; // Polygon cần ít nhất 3 điểm
    } catch (e) {
      console.warn(`Lỗi boundary khu vực: ${area.name}`, e);
      return null;
    }
  }, [area.boundary, area.name]);

  // 2. Lấy Style mặc định dựa trên loại khu vực (Quận/Phường)
  const defaultStyle = useMemo(() => getAreaStyle(area.type), [area.type]);

  // 3. Xử lý sự kiện
  const eventHandlers = useMemo(
    () => ({
      mouseover: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#fbbf24", // Màu vàng hổ phách khi hover
          fillOpacity: 0.3,
          dashArray: "", // Bỏ nét đứt khi hover
        });
        layer.bringToFront(); // Đưa lên trên cùng
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle(defaultStyle); // Reset về style gốc
      },
      click: (e: L.LeafletMouseEvent) => {
        // 🔥 Tính năng Zoom vào khu vực khi click
        map.fitBounds(e.target.getBounds(), {
          padding: [50, 50],
          animate: true,
          duration: 1,
        });
      },
    }),
    [map, defaultStyle],
  );

  if (!positions) return null;

  return (
    <Polygon
      positions={positions}
      pathOptions={defaultStyle}
      eventHandlers={eventHandlers}
    >
      {/* Tooltip hiển thị tên */}
      <Tooltip
        direction="center"
        permanent={area.type === AreaType.DISTRICT} // Quận thì hiện luôn, Phường thì hover mới hiện
        className="bg-transparent border-none shadow-none text-slate-700 font-bold text-xs drop-shadow-md"
      >
        {area.name}
      </Tooltip>

      <Popup minWidth={300} closeButton={false} className="custom-popup">
        <AreaPopupCard
          data={area}
          onViewDetails={(id) => console.log("Xem chi tiết", id)}
        />
      </Popup>
    </Polygon>
  );
};

// --- COMPONENT CHÍNH ---
interface Props {
  data: IArea[];
}

const AreaLayer: React.FC<Props> = ({ data }) => {
  // Lọc bỏ các data rác ngay từ đầu
  const validAreas = useMemo(() => {
    return data.filter((area) => area.boundary && Array.isArray(area.boundary));
  }, [data]);

  return (
    <>
      {validAreas.map((area) => (
        <AreaPolygon key={area.id} area={area} />
      ))}
    </>
  );
};

export default React.memo(AreaLayer);
