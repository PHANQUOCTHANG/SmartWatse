import L from "leaflet";

// Hàm tạo HTML cho Marker (Sử dụng Tailwind CSS trong chuỗi HTML)
const createMarkerHtml = (colorClass: string, iconHtml: string) => `
  <div class="relative flex items-center justify-center w-10 h-10">
    <span class="absolute inline-flex w-full h-full rounded-full opacity-30 animate-ping ${colorClass}"></span>
    <span class="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md ${colorClass} text-white">
      ${iconHtml}
    </span>
    <div class="absolute -bottom-1 w-2 h-2 bg-white transform rotate-45"></div>
  </div>
`;

// Icon Thùng rác (SVG string lấy từ Lucide)
const TRASH_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

export const createBinIcon = (status: string) => {
  let colorClass = "bg-emerald-500"; // Mặc định: Xanh (Trống)

  if (status === "FULL") colorClass = "bg-amber-500"; // Vàng (Sắp đầy)
  if (status === "OVERLOAD" || status === "BROKEN") colorClass = "bg-rose-500"; // Đỏ (Quá tải)

  return L.divIcon({
    className: "custom-marker-icon", // Class rỗng để reset style mặc định
    html: createMarkerHtml(colorClass, TRASH_ICON_SVG),
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Căn giữa đáy
    popupAnchor: [0, -40], // Popup hiện phía trên
  });
};

// Icon User (Vị trí hiện tại)
export const userIcon = L.divIcon({
  className: "custom-user-icon",
  html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg ring-4 ring-blue-600/30"></div>`,
  iconSize: [16, 16],
});
