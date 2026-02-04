import L from "leaflet";
import { BinType, BinStatus } from "@/features/bin/types";
import { VehicleStatus, VehicleType } from "@/features/vehicles/types";
import { AreaType } from "@/features/area/types";

// --- HELPER: MÀU SẮC CHO BIN ---
export const getBinColor = (type: BinType) => {
  switch (type) {
    case BinType.ORGANIC:
      return "#16a34a"; // Green-600 (Hữu cơ)
    case BinType.RECYCLE:
      return "#2563eb"; // Blue-600 (Tái chế)
    case BinType.INORGANIC:
      return "#ea580c"; // Orange-600 (Vô cơ/Khác)
    default:
      return "#4b5563"; // Gray (Mặc định)
  }
};

export const getBinStatusEffect = (status: BinStatus) => {
  switch (status) {
    case BinStatus.FULL:
    case BinStatus.OVERFLOW:
      return "animate-pulse ring-4 ring-red-500 ring-opacity-50"; // Nhấp nháy đỏ báo động
    case BinStatus.BROKEN:
    case BinStatus.MAINTENANCE:
      return "opacity-60 grayscale"; // Xám màu bảo trì
    case BinStatus.ACTIVE:
    default:
      return "shadow-md"; // Bình thường
  }
};

// --- HELPER: MÀU SẮC CHO XE ---
export const getVehicleColor = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.AVAILABLE:
      return "#22c55e"; // Green (Sẵn sàng)
    case VehicleStatus.IN_USE:
      return "#3b82f6"; // Blue (Đang chạy)
    case VehicleStatus.FULL:
      return "#ef4444"; // Red (Đầy rác)
    case VehicleStatus.MAINTENANCE:
      return "#eab308"; // Yellow (Bảo trì)
    case VehicleStatus.OFFLINE:
      return "#9ca3af"; // Gray (Mất kết nối)
    default:
      return "#6b7280";
  }
};
export const createBinIcon = (type: BinType, status: BinStatus) => {
  const color = getBinColor(type);
  const effectClass = getBinStatusEffect(status);

  // Icon thùng rác SVG
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
      <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm3-5h8v2H8V4z"/>
    </svg>
  `;

  // Nếu bị hỏng/bảo trì thì thêm icon cờ lê
  const maintenanceOverlay =
    status === BinStatus.MAINTENANCE || status === BinStatus.BROKEN
      ? `<div style="position:absolute; bottom:-4px; right:-4px; background:yellow; border-radius:50%; padding:2px; border:1px solid black;">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
       </div>`
      : "";

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${effectClass}" style="background-color: ${color};">
        ${svgIcon}
        ${maintenanceOverlay}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -10],
  });
};

export const createVehicleIcon = (
  type: VehicleType,
  status: VehicleStatus,
  heading: number = 0,
) => {
  const color = getVehicleColor(status);

  // Chọn hình dáng xe dựa trên Type
  let pathD = "";
  if (type === VehicleType.COMPACTOR) {
    // Hình xe ép rác (lớn, vuông vức)
    pathD = "M1 3h22v18H1z M1 21h4v2H1z M19 21h4v2H19z M4 3V1h16v2";
  } else if (type === VehicleType.TRUCK) {
    // Hình xe tải thùng (đầu xe + thùng hở)
    pathD = "M2 5h20v14H2z M2 19h4v3H2z M18 19h4v3H18z M2 5V2h20v3";
  } else {
    // COLLECTOR (Xe nhỏ/Ba gác)
    pathD = "M6 4h12v16H6z M4 16h2v4H4z M18 16h2v4H18z M10 1v3h4V1";
  }

  // SVG Xe nhìn từ trên xuống (Top-down)
  // Stroke color là màu trạng thái, Fill là trắng hoặc nhạt hơn
  const vehicleSvg = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathD}" fill="white" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M5 1L5 2 M19 1L1 2" stroke="${color}" stroke-width="2"/>
      <path d="M12 8L12 16 M9 12L12 8L15 12" stroke="${color}" stroke-width="2" stroke-opacity="0.5"/>
    </svg>
  `;

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease-in-out; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
         ${vehicleSvg}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};
export const createCollectionPointIcon = () => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative group">
        <div style="
          width: 40px; 
          height: 40px; 
          background: linear-gradient(135deg, #7c3aed, #5b21b6); 
          border: 2px solid white; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"/>
            </svg>
          </div>
        </div>
        <div style="
          position: absolute; 
          bottom: -5px; 
          left: 10px; 
          width: 20px; 
          height: 6px; 
          background: rgba(0,0,0,0.3); 
          border-radius: 50%; 
          filter: blur(2px);
        "></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 42], // Mũi nhọn nằm đúng vị trí
    popupAnchor: [0, -45],
  });
};
export const getAreaStyle = (type: AreaType) => {
  if (type === AreaType.DISTRICT) {
    return {
      color: "#4f46e5", // Indigo-600 (Viền đậm)
      weight: 3, // Viền dày
      opacity: 1,
      fillColor: "#6366f1", // Indigo-500
      fillOpacity: 0.1, // Fill rất nhạt để nhìn xuyên thấu
      dashArray: "",
    };
  } else {
    // WARD (Phường/Xã)
    return {
      color: "#0ea5e9", // Sky-500 (Viền sáng hơn)
      weight: 1.5, // Viền mỏng
      opacity: 0.8,
      fillColor: "#38bdf8", // Sky-400
      fillOpacity: 0.05, // Fill cực nhạt
      dashArray: "5, 5", // Viền nét đứt
    };
  }
};
// Swap Coordinates cho GeoJSON
export const swapLngLat = (coordinates: number[][][]): L.LatLngExpression[] => {
  if (!coordinates || coordinates.length === 0 || !coordinates[0]) {
    return [];
  }
  return coordinates[0].map((point) => {
    if (!point || point.length < 2) return [0, 0];
    return [point[1], point[0]] as [number, number];
  });
};

// Calculate Bearing
export const calculateBearing = (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
) => {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) *
      Math.cos(destLatRad) *
      Math.cos(destLngRad - startLngRad);

  let brng = Math.atan2(y, x);
  brng = (brng * 180) / Math.PI;
  return (brng + 360) % 360;
};
