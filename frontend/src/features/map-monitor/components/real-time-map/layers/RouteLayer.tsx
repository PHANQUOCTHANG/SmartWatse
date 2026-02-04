import React, { useEffect, useState, useRef } from "react";
import { Polyline, Tooltip, useMap, Marker } from "react-leaflet";
import L, { LatLng, LatLngTuple } from "leaflet";
import { toast } from "sonner";
import {
  Navigation,
  Clock,
  AlertCircle,
  TrendingUp,
  TrafficCone,
} from "lucide-react";
import { divIcon } from "leaflet";

// --- 1. Custom Icons (Tối ưu performance bằng HTML string cứng) ---
const createEndpointIcon = (type: "start" | "end") => {
  const colorClass =
    type === "start"
      ? "bg-emerald-500 border-emerald-600"
      : "bg-rose-500 border-rose-600";
  const shadowColor =
    type === "start" ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)";

  // Sử dụng CSS inline để đảm bảo style không bị override
  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px; height: 24px;
    ">
      <div style="
        position: absolute;
        width: 100%; height: 100%;
        border-radius: 50%;
        background-color: ${shadowColor};
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div class="${colorClass}" style="
        position: relative;
        width: 16px; height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    </div>
  `;

  return divIcon({
    html,
    className: "bg-transparent",
    iconSize: [24, 24],
    iconAnchor: [12, 12], // Center anchor
  });
};

interface Props {
  start: LatLng | [number, number] | null;
  end: LatLng | [number, number] | null;
  color?: string;
  showTurnPoints?: boolean;
  /** Tự động zoom fit bounds khi có route */
  autoFitBounds?: boolean;
}

const RouteLayer: React.FC<Props> = ({
  start,
  end,
  color = "#3b82f6",
  showTurnPoints = false,
  autoFitBounds = true,
}) => {
  const map = useMap();
  const [path, setPath] = useState<LatLngTuple[]>([]);
  const [turns, setTurns] = useState<LatLngTuple[]>([]);
  const [info, setInfo] = useState({ distance: "0", duration: 0, steps: 0 });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Ref để tránh race condition khi gọi API nhiều lần
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper: Normalize coordinates an toàn
  const getCoord = (c: LatLng | [number, number]): [number, number] => {
    if (!c) return [0, 0];
    return Array.isArray(c) ? c : [c.lat, c.lng];
  };

  useEffect(() => {
    if (!start || !end) {
      setPath([]);
      setStatus("idle");
      return;
    }

    const s = getCoord(start);
    const e = getCoord(end);

    // Kiểm tra toạ độ hợp lệ (tránh NaN)
    if (isNaN(s[0]) || isNaN(s[1]) || isNaN(e[0]) || isNaN(e[1])) return;

    const fetchRoute = async () => {
      // Cancel request cũ
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      setStatus("loading");

      try {
        // 🔥 PRODUCTION TIP: Nên dùng Mapbox hoặc Google Directions API qua Backend Proxy để bảo mật Key
        // Ở đây dùng OSRM demo nhưng thêm options overview=full để đường mượt hơn
        const url = `https://router.project-osrm.org/route/v1/driving/${s[1]},${s[0]};${e[1]},${e[0]}?overview=full&geometries=geojson&steps=true`;

        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });
        if (!res.ok) throw new Error("Routing Service Unavailable");

        const data = await res.json();

        if (data.code !== "Ok" || !data.routes?.[0]) {
          throw new Error("No route found");
        }

        const route = data.routes[0];

        // 1. Decode Geometry (GeoJSON [lng, lat] -> Leaflet [lat, lng])
        const decodedPath = route.geometry.coordinates.map(
          (c: number[]) => [c[1], c[0]] as LatLngTuple,
        );
        setPath(decodedPath);

        // 2. Turn Points
        if (showTurnPoints && route.legs[0]?.steps) {
          const turnCoords = route.legs[0].steps.map(
            (step: any) =>
              [
                step.maneuver.location[1],
                step.maneuver.location[0],
              ] as LatLngTuple,
          );
          setTurns(turnCoords);
        }

        // 3. Info Parsing
        setInfo({
          distance: (route.distance / 1000).toFixed(1), // km (1 decimal)
          duration: Math.ceil(route.duration / 60), // minutes
          steps: route.legs[0]?.steps?.length || 0,
        });

        setStatus("success");
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.warn("Route fetch failed:", err);
        setStatus("error");
        // Fallback: Vẽ đường thẳng nếu API lỗi (để user không thấy trống trơn)
        setPath([s, e]);
        toast.error(
          "Không thể tải lộ trình chi tiết. Đang hiển thị đường chim bay.",
        );
      }
    };

    fetchRoute();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [start, end, showTurnPoints]); // Dependencies

  // --- Auto Zoom Effect (Chỉ chạy 1 lần khi route success) ---
  useEffect(() => {
    if (autoFitBounds && path.length > 0 && status === "success") {
      const bounds = L.latLngBounds(path);
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 1, // 1s animation
        });
      }
    }
  }, [path, status, map, autoFitBounds]);

  if (!start || !end || path.length === 0) return null;

  const startCoord = getCoord(start);
  const endCoord = getCoord(end);

  // Styling based on status
  const isError = status === "error";
  const isLoading = status === "loading";

  const mainColor = isError ? "#ef4444" : isLoading ? "#94a3b8" : color;
  const opacity = isLoading ? 0.6 : 1;
  const dashArray = isLoading ? "10, 10" : undefined; // Nét đứt khi loading

  return (
    <>
      {/* 1. Endpoints Markers */}
      <Marker
        position={startCoord}
        icon={createEndpointIcon("start")}
        zIndexOffset={1000}
      />
      <Marker
        position={endCoord}
        icon={createEndpointIcon("end")}
        zIndexOffset={1000}
      />

      {/* 2. Turn Points (Optional - Low zIndex) */}
      {showTurnPoints &&
        status === "success" &&
        turns.map((turn, idx) => (
          <Marker
            key={`turn-${idx}`}
            position={turn}
            icon={divIcon({
              className: "",
              html: `<div class="w-1.5 h-1.5 bg-white rounded-full border border-slate-400 opacity-80"></div>`,
              iconSize: [6, 6],
            })}
          />
        ))}

      {/* 3. Route Background (Viền trắng giúp nổi bật trên nền vệ tinh/tối) */}
      <Polyline
        positions={path}
        pathOptions={{
          color: "white",
          weight: 7,
          opacity: 0.8,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* 4. Main Route Line */}
      <Polyline
        positions={path}
        pathOptions={{
          color: mainColor,
          weight: 4,
          opacity: opacity,
          dashArray: dashArray,
          className: status === "success" ? "route-flow" : "", // CSS Animation class
          lineCap: "round",
          lineJoin: "round",
        }}
      >
        {/* 5. Smart Tooltip (Sticky but offset) */}
        <Tooltip
          sticky
          direction="top"
          offset={[0, -10]}
          opacity={1}
          className="custom-route-tooltip"
        >
          <div className="flex flex-col gap-2 min-w-[160px] font-sans">
            {/* Header Status */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {isLoading
                  ? "Đang tính toán..."
                  : isError
                    ? "Đường chim bay"
                    : "Lộ trình tối ưu"}
              </span>
              {isError && <AlertCircle size={12} className="text-red-500" />}
              {status === "success" && (
                <TrendingUp size={12} className="text-emerald-500" />
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Navigation size={10} /> Quãng đường
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {info.distance} km
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={10} /> Thời gian
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-sm font-bold ${info.duration > 45 ? "text-orange-600" : "text-emerald-600"}`}
                  >
                    {info.duration}
                  </span>
                  <span className="text-[10px] text-slate-500">phút</span>
                </div>
              </div>
            </div>

            {/* Footer: Traffic info simulation */}
            {status === "success" && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded">
                <TrafficCone size={10} className="text-orange-400" />
                <span>
                  Mật độ giao thông:{" "}
                  <span className="text-emerald-600 font-bold">Thấp</span>
                </span>
              </div>
            )}
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
};

// Dùng Memo để tránh re-render khi map di chuyển (pan/zoom)
export default React.memo(RouteLayer, (prev, next) => {
  const pS = prev.start as [number, number];
  const nS = next.start as [number, number];
  const pE = prev.end as [number, number];
  const nE = next.end as [number, number];

  // Chỉ re-render khi toạ độ Start hoặc End thay đổi
  return (
    pS?.[0] === nS?.[0] &&
    pS?.[1] === nS?.[1] &&
    pE?.[0] === nE?.[0] &&
    pE?.[1] === nE?.[1] &&
    prev.color === next.color
  );
});
