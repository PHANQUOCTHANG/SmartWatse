import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { useMapMonitorStore } from "../../store/mapMonitorStore";
import { mockBins } from "../../data/mockBins";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const selectBin = useMapMonitorStore((s) => s.selectBin);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.700806, 10.776889], // lng, lat
      zoom: 13,
    });

    // Add markers
    mockBins.forEach((bin) => {
      const el = document.createElement("div");
      el.className = "bin-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      el.style.background =
        bin.status === "OVERFLOW"
          ? "#ef4444"
          : bin.status === "NEARLY_FULL"
          ? "#facc15"
          : "#22c55e";

      el.onclick = () => selectBin(bin);

      new mapboxgl.Marker(el)
        .setLngLat([bin.lng, bin.lat])
        .addTo(mapRef.current!);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return <div ref={mapContainerRef} className="absolute inset-0" />;
}
