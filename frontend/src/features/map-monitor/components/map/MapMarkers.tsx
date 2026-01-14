import mapboxgl from "mapbox-gl";
import { Bin } from "../../types";
import { getMarkerColor } from "./mapboxStyles";
import { useMapMonitorStore } from "../../store/mapMonitorStore";

type Props = {
  map: mapboxgl.Map;
  bins: Bin[];
};

export default function MapMarkers({ map, bins }: Props) {
  const selectBin = useMapMonitorStore((s) => s.selectBin);

  // Clear old markers (quan trọng khi filter)
  const markers: mapboxgl.Marker[] = [];

  bins.forEach((bin) => {
    const el = document.createElement("div");
    el.className = "bin-marker";
    el.style.width = "14px";
    el.style.height = "14px";
    el.style.borderRadius = "50%";
    el.style.cursor = "pointer";
    el.style.backgroundColor = getMarkerColor(bin.status);
    el.style.boxShadow = "0 0 0 2px white";

    el.onclick = () => selectBin(bin);

    const marker = new mapboxgl.Marker(el)
      .setLngLat([bin.lng, bin.lat])
      .addTo(map);

    markers.push(marker);
  });

  // Cleanup khi rerender
  return () => {
    markers.forEach((m) => m.remove());
  };
}
