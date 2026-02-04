import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { IArea } from "@/features/area/types";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { swapLngLat } from "@/features/map-monitor/utils/mapIcons";
import { toast } from "sonner";
import { isPolygonInside } from "@/utils/geoUtils";

// Fix icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔥 COMPONENT AUTO ZOOM (ĐÃ NÂNG CẤP)
const MapAutoFitter = ({
  coords,
  parentCoords,
}: {
  coords?: number[][][];
  parentCoords?: number[][][];
}) => {
  const map = useMap();

  useEffect(() => {
    // Logic ưu tiên:
    // 1. Nếu đang có hình vẽ (Edit hoặc vừa vẽ xong) -> Zoom vào hình đó
    // 2. Nếu chưa có hình, nhưng có Parent (Create) -> Zoom vào Parent
    let targetCoords = coords;

    if (!targetCoords || targetCoords.length === 0) {
      targetCoords = parentCoords;
    }

    if (targetCoords && targetCoords.length > 0) {
      try {
        // Chuyển đổi sang LatLng để lấy bounds
        const latLngs = swapLngLat(targetCoords);
        if (latLngs && latLngs.length > 0) {
          const bounds = L.polygon(latLngs).getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
          }
        }
      } catch (e) {
        console.error("Map fit bounds error", e);
      }
    }
  }, [coords, parentCoords, map]); // Lắng nghe cả 2 biến đổi

  return null;
};

interface Props {
  value?: number[][][];
  onChange: (val: number[][][]) => void;
  existingAreas: IArea[];
  parentBoundary?: number[][][];
  error?: string;
}

export const AreaBoundaryEditor: React.FC<Props> = ({
  value,
  onChange,
  existingAreas,
  error,
  parentBoundary,
}) => {
  // Mặc định HCM nếu không có dữ liệu gì
  const [mapCenter] = useState<[number, number]>([10.762622, 106.660172]);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [isDrawing, setIsDrawing] = useState(!!(value && value.length > 0));

  // --- VALIDATE HELPER ---
  const validateBounds = (coords: number[][][]) => {
    if (!parentBoundary) return true;
    return isPolygonInside(parentBoundary, coords);
  };

  // --- HANDLERS ---
  const _onCreated = (e: any) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    const geoJsonCoords = latlngs.map((ll: any) => [ll.lng, ll.lat]);

    // Đóng vòng
    if (geoJsonCoords.length > 0) {
      const first = geoJsonCoords[0];
      const last = geoJsonCoords[geoJsonCoords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        geoJsonCoords.push(first);
      }
    }

    const newVal = [geoJsonCoords];

    // Validate Parent
    if (!validateBounds(newVal)) {
      toast.error("Lỗi: Vùng vẽ nằm ngoài ranh giới cha!", {
        description: "Vui lòng vẽ lại nằm gọn trong viền đỏ.",
      });
      // Xóa layer sai
      if (featureGroupRef.current) {
        featureGroupRef.current.removeLayer(layer);
      }
      return;
    }

    onChange(newVal);
    setIsDrawing(true);
  };

  const _onEdited = (e: any) => {
    let isValid = true;
    let newVal: number[][][] = [];

    e.layers.eachLayer((layer: any) => {
      const latlngs = layer.getLatLngs()[0];
      const geoJsonCoords = latlngs.map((ll: any) => [ll.lng, ll.lat]);

      // Đóng vòng
      if (geoJsonCoords.length > 0) {
        const first = geoJsonCoords[0];
        const last = geoJsonCoords[geoJsonCoords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          geoJsonCoords.push(first);
        }
      }
      newVal = [geoJsonCoords];

      if (!validateBounds(newVal)) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Chỉnh sửa không hợp lệ: Vùng bị tràn ra ngoài!");
      // Reset về rỗng hoặc giữ giá trị cũ tùy logic (ở đây chọn reset để an toàn)
      onChange([]);
      // Xóa visual trên map để user biết là sai
      featureGroupRef.current?.clearLayers();
      setIsDrawing(false);
    } else {
      onChange(newVal);
    }
  };

  const _onDeleted = () => {
    onChange([]);
    setIsDrawing(false);
  };

  const handleReset = () => {
    featureGroupRef.current?.clearLayers();
    onChange([]);
    setIsDrawing(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-slate-300 shadow-sm group">
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔥 1. GỌI AUTO FITTER VỚI CẢ 2 PROPS */}
          <MapAutoFitter coords={value} parentCoords={parentBoundary} />

          {/* 2. HIỂN THỊ RANH GIỚI CHA */}
          {parentBoundary && (
            <Polygon
              positions={swapLngLat(parentBoundary) || []}
              pathOptions={{
                color: "#ef4444",
                fill: false,
                weight: 2,
                dashArray: "10, 10",
                opacity: 0.8,
              }}
              interactive={false}
            >
              <Tooltip
                direction="top"
                permanent
                offset={[0, -20]}
                className="text-red-500 font-bold border-red-200 bg-white/90"
              >
                Ranh giới Quận (Vẽ bên trong)
              </Tooltip>
            </Polygon>
          )}

          {/* 3. HIỂN THỊ CÁC KHU VỰC KHÁC */}
          {existingAreas.map((area) => {
            if (!area.boundary || area.boundary.length === 0) return null;
            const positions = swapLngLat(area.boundary);
            if (!positions) return null;
            return (
              <Polygon
                key={area.id}
                positions={positions}
                pathOptions={{
                  color: "#64748b",
                  fillColor: "#94a3b8",
                  fillOpacity: 0.1,
                  weight: 1,
                  dashArray: "5, 5",
                }}
                interactive={false}
              >
                <Tooltip
                  sticky
                  direction="center"
                  className="text-[10px] font-bold opacity-60"
                >
                  {area.name}
                </Tooltip>
              </Polygon>
            );
          })}

          {/* 4. CÔNG CỤ VẼ */}
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={_onCreated}
              onEdited={_onEdited}
              onDeleted={_onDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  shapeOptions: { color: "#2563eb", fillOpacity: 0.4 },
                },
              }}
              edit={{ edit: {}, remove: {} }}
            />

            {/* Vẽ lại hình đang có (Edit Mode) */}
            {value && value.length > 0 && !isDrawing && (
              <Polygon
                positions={swapLngLat(value) || []}
                pathOptions={{ color: "#2563eb" }}
              />
            )}
          </FeatureGroup>
        </MapContainer>

        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 p-2 rounded-lg shadow-lg backdrop-blur text-xs space-y-2">
          <div className="font-bold text-slate-700">
            Chế độ: {value && value.length > 0 ? "Chỉnh sửa" : "Vẽ mới"}
          </div>
          {parentBoundary && (
            <p className="text-red-500 font-medium border-t border-slate-200 pt-1">
              ⚠️ Giới hạn trong viền đỏ
            </p>
          )}
          {isDrawing && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReset}
              className="w-full h-7 text-xs"
            >
              <Eraser className="size-3 mr-1" /> Xóa hình này
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
};
