import { BinStatus } from "@/features/map-monitor/types/types";
import L from "leaflet";

export const createBinIcon = (status: BinStatus) => {
  let colorClass = "bg-emerald-500 border-emerald-600 shadow-emerald-200";
  let pulseClass = "";

  switch (status) {
    case BinStatus.FULL:
      colorClass = "bg-yellow-500 border-yellow-600 shadow-yellow-200";
      break;
    case BinStatus.OVERLOAD:
      colorClass = "bg-red-600 border-red-700 shadow-red-300";
      pulseClass = "animate-ping"; // Hiệu ứng nhấp nháy báo động
      break;
    case BinStatus.BROKEN:
      colorClass = "bg-gray-500 border-gray-600 shadow-gray-300";
      break;
  }

  const html = `
    <div class="relative w-full h-full flex items-center justify-center">
      ${pulseClass ? `<span class="absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass.split(" ")[0]} ${pulseClass}"></span>` : ""}
      <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-md ${colorClass}"></span>
    </div>
  `;

  return L.divIcon({
    className: "custom-bin-marker",
    html: html,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
};

export const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg ring-4 ring-blue-500/30"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
