import L from "leaflet";

export const getBinIcon = (status: string, level: number) => {
  let color = "#10b981"; // Green
  if (level > 75) color = "#f59e0b"; // Yellow
  if (level > 90 || status === "FULL") color = "#ef4444"; // Red

  return L.divIcon({
    className: "custom-bin-marker",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
  });
};

export const truckIcon = L.divIcon({
  className: "truck-marker truck-marker-transition",
  html: `<div style="background: white; padding: 4px; border-radius: 50%; border: 1px solid #ef4444; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">🚛</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
