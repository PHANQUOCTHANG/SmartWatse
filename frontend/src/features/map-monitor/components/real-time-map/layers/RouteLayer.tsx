import React, { useEffect, useState, useRef } from "react";
import { Polyline, Tooltip, useMap, Marker } from "react-leaflet";
import L, { LatLng, LatLngTuple } from "leaflet";
import { toast } from "sonner";
import { Navigation, MapPin, Clock, Gauge, AlertCircle } from "lucide-react";
import { divIcon } from "leaflet";

// --- 1. Custom Icons ---
const createEndpointIcon = (type: "start" | "end") => {
  const color = type === "start" ? "bg-emerald-600" : "bg-rose-600";
  const ringColor = type === "start" ? "ring-emerald-200" : "ring-rose-200";

  const html = `
    <div class="relative flex items-center justify-center w-10 h-10 group">
      <span class="absolute inline-flex h-full w-full rounded-full ${color} opacity-20 animate-ping"></span>
      
      <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${color} shadow-xl border-[3px] border-white ring-2 ${ringColor} transition-transform group-hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
           ${
             type === "start"
               ? '<polygon points="3 11 22 2 13 21 11 13 3 11"/>'
               : '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
           }
        </svg>
      </div>
      
      ${type === "start" ? `<div class="absolute -bottom-1 w-2 h-2 ${color} rotate-45 border-b-2 border-r-2 border-white"></div>` : ""}
    </div>
  `;

  return divIcon({
    html,
    className: "custom-marker-endpoint bg-transparent",
    iconSize: [40, 40],
    iconAnchor: [20, 36], // Anchor perfectly at the bottom
    popupAnchor: [0, -40],
  });
};

interface Props {
  start: LatLng | [number, number] | null;
  end: LatLng | [number, number] | null;
  color?: string;
  showTurnPoints?: boolean; // New Feature
}

const RouteLayer: React.FC<Props> = ({
  start,
  end,
  color = "#3b82f6",
  showTurnPoints = false,
}) => {
  const map = useMap();
  const [path, setPath] = useState<LatLngTuple[]>([]);
  const [turns, setTurns] = useState<LatLngTuple[]>([]); // To show dots at turns
  const [info, setInfo] = useState({ distance: "0", duration: 0, steps: 0 });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper: Normalize coordinates
  const getCoord = (c: LatLng | [number, number]): [number, number] =>
    Array.isArray(c) ? c : [c.lat, c.lng];

  useEffect(() => {
    if (!start || !end) {
      setPath([]);
      setTurns([]);
      return;
    }

    const fetchRoute = async () => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setStatus("loading");

      try {
        const s = getCoord(start);
        const e = getCoord(end);

        // OSRM API (Demo server)
        const url = `https://router.project-osrm.org/route/v1/driving/${s[1]},${s[0]};${e[1]},${e[0]}?overview=full&geometries=geojson&steps=true`;

        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });
        if (!res.ok) throw new Error("API Error");

        const data = await res.json();

        if (data.routes?.[0]) {
          const route = data.routes[0];

          // 1. Main Path
          const decodedPath = route.geometry.coordinates.map(
            (c: number[]) => [c[1], c[0]] as LatLngTuple,
          );
          setPath(decodedPath);

          // 2. Extract Turn Points (Maneuvers)
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

          // 3. Info
          setInfo({
            distance: (route.distance / 1000).toFixed(2),
            duration: Math.ceil(route.duration / 60),
            steps: route.legs[0]?.steps?.length || 0,
          });

          setStatus("success");
        } else {
          setStatus("error");
          toast.error("Không tìm thấy đường đi phù hợp");
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Route Error:", err);
        setStatus("error");

        // Fallback: Straight line
        const s = getCoord(start);
        const e = getCoord(end);
        setPath([s, e]);
      }
    };

    fetchRoute();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [start, end, showTurnPoints]);

  // --- Auto Zoom Effect ---
  useEffect(() => {
    if (path.length > 0 && status === "success") {
      const bounds = L.latLngBounds(path);
      if (bounds.isValid()) {
        map.flyToBounds(bounds, {
          padding: [100, 100], // Generous padding
          maxZoom: 16,
          duration: 1.5, // Smooth fly animation
        });
      }
    }
  }, [path, map, status]);

  if (!start || !end || path.length === 0) return null;

  const startCoord = getCoord(start);
  const endCoord = getCoord(end);

  // Colors based on status
  const pathColor =
    status === "error" ? "#ef4444" : status === "loading" ? "#9ca3af" : color;
  const dashArray = status === "loading" ? "5, 10" : "10, 15";

  return (
    <>
      {/* 1. Markers */}
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

      {/* 2. Turn Points (Small dots at intersections) */}
      {showTurnPoints &&
        status === "success" &&
        turns.map((turn, idx) => (
          <Marker
            key={idx}
            position={turn}
            icon={divIcon({
              className: "bg-transparent",
              html: `<div class="w-2 h-2 bg-white rounded-full border border-slate-400 shadow-sm"></div>`,
            })}
          />
        ))}

      {/* 3. Outer Glow / Border (Visibility on Satellite Maps) */}
      <Polyline
        positions={path}
        pathOptions={{
          color: "white",
          weight: 8,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* 4. Main Animated Path */}
      <Polyline
        positions={path}
        pathOptions={{
          color: pathColor,
          weight: 5,
          opacity: 1,
          dashArray: dashArray,
          className: status === "success" ? "route-flow route-pulse" : "", // Applying CSS animations
          lineCap: "round",
        }}
      >
        {/* 5. Rich Info Tooltip */}

        <Tooltip sticky direction="top" offset={[0, -10]} opacity={1}>
          <div className="flex flex-col gap-1.5 min-w-[140px] p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-100 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {status === "loading"
                  ? "Đang tính toán..."
                  : "Chi tiết lộ trình"}
              </span>
              {status === "error" && (
                <AlertCircle size={12} className="text-red-500" />
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Navigation size={10} /> Khoảng cách
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {info.distance} km
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={10} /> Thời gian
                </span>
                <span
                  className={`text-sm font-bold ${Number(info.duration) > 60 ? "text-orange-600" : "text-emerald-600"}`}
                >
                  {info.duration} phút
                </span>
              </div>
            </div>

            {/* Footer Info */}
            {status === "success" && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-50 p-1 rounded mt-1">
                <Gauge size={10} />
                <span>Đi qua {info.steps} đoạn đường</span>
              </div>
            )}
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
};

export default React.memo(RouteLayer);
