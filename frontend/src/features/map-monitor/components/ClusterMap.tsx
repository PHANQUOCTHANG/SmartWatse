import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
  ScaleControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { Loader2, RefreshCw, Crosshair } from "lucide-react";

import { useMapBins } from "../hooks/useMapBins";
import { createBinIcon, userIcon } from "../utils/mapIcons";
import { BinPopup } from "./BinPopup";
import { StatsPanel, FilterBadges } from "./MapOverlays";
import { IBin } from "@/features/bin";

const FlyToLocation = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { animate: true, duration: 1.5 });
  }, [coords, map]);
  return null;
};

export const ClusterMap = ({
  defaultCenter = [10.762, 106.66],
  height = "85vh",
}: {
  defaultCenter?: [number, number];
  height?: string;
}) => {
  const { bins, loading, filterMode, setFilterMode, refresh } = useMapBins();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ!");
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Không thể lấy vị trí!"),
    );
  };

  // Helper tọa độ
  const getPos = (bin: IBin): [number, number] | null => {
    if (bin.location?.coordinates)
      return [bin.location.coordinates[1], bin.location.coordinates[0]];
    return null;
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-100 isolate"
      style={{ height }}
    >
      {/* 1. LOADING */}
      {loading && (
        <div className="absolute inset-0 z-[1100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {/* 2. OVERLAYS UI (Z-INDEX CAO) */}
      <FilterBadges currentMode={filterMode} setMode={setFilterMode} />
      <StatsPanel bins={bins} />

      {/* Control buttons (Refresh / Locate) - Nhỏ gọn bên phải */}
      <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={refresh}
          className="bg-white p-2.5 rounded-full shadow-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <RefreshCw className="size-5" />
        </button>
        <button
          onClick={handleLocateMe}
          className="bg-white p-2.5 rounded-full shadow-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Crosshair className="size-5" />
        </button>
      </div>

      {/* 3. MAP CONTAINER */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        zoomControl={false}
        className="h-full w-full z-0 outline-none"
      >
        <ZoomControl position="topleft" />

        {/* CARTO VOYAGER: Nền map sáng, sạch, hiện đại như hình */}
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <FlyToLocation coords={userLocation} />
        {userLocation && <Marker position={userLocation} icon={userIcon} />}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {bins.map((bin) => {
            const pos = getPos(bin);
            if (!pos) return null;
            return (
              <Marker
                key={bin._id}
                position={pos}
                icon={createBinIcon(bin.status)}
              >
                <BinPopup bin={bin} />
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
