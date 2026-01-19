import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { useMapBins } from "../hooks/useMapBins";
import { createBinIcon, userIcon } from "../utils/mapIcons";
import { BinPopup } from "./BinPopup";
import { MapControls } from "./MapControls";

// Component phụ: Xử lý hiệu ứng bay tới vị trí
const FlyToLocation = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15, { duration: 1.5 });
  }, [coords, map]);
  return null;
};

interface Props {
  defaultCenter?: [number, number];
  height?: string;
}

export const ClusterMap = ({
  defaultCenter = [10.762, 106.66],
  height = "80vh",
}: Props) => {
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

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
      style={{ height }}
    >
      {/* Controls UI */}
      <MapControls
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        onLocate={handleLocateMe}
        onRefresh={refresh}
      />

      {loading && (
        <div className="absolute inset-0 z-[500] bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Map Tiles: CartoDB Voyager (Đẹp, sáng, chuyên nghiệp) */}
        <TileLayer
          attribution="&copy; OSM contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <FlyToLocation coords={userLocation} />

        {/* User Location */}
        {userLocation && <Marker position={userLocation} icon={userIcon} />}

        {/* Bins Clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
        >
          {bins.map((bin) => (
            <Marker
              key={bin.id}
              position={[bin.latitude, bin.longitude]}
              icon={createBinIcon(bin.status)}
            >
              <BinPopup bin={bin} />
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
