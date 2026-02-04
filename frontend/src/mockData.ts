import { VehicleStatus, VehicleType } from "@/features/vehicles/types";
import { AreaType } from "@/features/area/types";
import { BinStatus, BinType } from "@/features/bin/types";

// Helper giả lập delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// --- 1. MOCK AREAS (Đã fix format boundary GeoJSON) ---
export const MOCK_AREAS = [
  {
    id: "area-001",
    name: "Quận 1",
    type: AreaType.DISTRICT,
    boundary: [
      // Lưu ý: GeoJSON chuẩn là [Longitude, Latitude] (Kinh độ trước, Vĩ độ sau)
      // Và phải bọc trong 1 mảng nữa (Outer Ring)
      [
        [106.6908, 10.7686],
        [106.702, 10.776],
        [106.705, 10.783],
        [106.698, 10.788],
        [106.685, 10.785],
        [106.68, 10.775],
        [106.6908, 10.7686], // Khép vòng
      ],
    ],
  },
  {
    id: "area-002",
    name: "Phường Bến Nghé",
    type: AreaType.WARD,
    parentId: "area-001",
    boundary: [
      [
        [106.7, 10.778],
        [106.704, 10.782],
        [106.699, 10.785],
        [106.696, 10.78],
        [106.7, 10.778],
      ],
    ],
  },
];

// --- 2. MOCK VEHICLES (Đã thêm heading) ---
export const MOCK_VEHICLES = [
  {
    id: "veh-001",
    plateNumber: "59A-123.45",
    areaId: "area-001", // Gắn với Quận 1
    type: VehicleType.COMPACTOR,
    capacity: 5000,
    currentLoad: 4500,
    fuelLevel: 45,
    status: VehicleStatus.IN_USE,
    coordinates: {
      lat: 10.772,
      lng: 106.698,
      heading: 45, // Xe đang quay hướng Đông Bắc
      lastUpdated: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "veh-002",
    plateNumber: "59C-888.99",
    areaId: "area-001",
    type: VehicleType.TRUCK,
    capacity: 3000,
    currentLoad: 0,
    fuelLevel: 100,
    status: VehicleStatus.AVAILABLE,
    coordinates: {
      lat: 10.765,
      lng: 106.69,
      heading: 180, // Hướng Nam
      lastUpdated: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  },
];

// --- 3. MOCK COLLECTION POINTS (Bổ sung) ---
export const MOCK_POINTS = [
  {
    id: "cp-001",
    name: "Điểm tập kết Hàm Nghi",
    areaId: "area-001",
    latitude: 10.7705,
    longitude: 106.7035,
    address: "Ngã tư Hàm Nghi - Hồ Tùng Mậu",
  },
  {
    id: "cp-002",
    name: "Bãi xe Công viên 23/9",
    areaId: "area-001",
    latitude: 10.767,
    longitude: 106.693,
    address: "Công viên 23/9",
  },
];

// --- 4. MOCK BINS ---
export const MOCK_BINS = [
  {
    id: "bin-001",
    code: "BIN-Q1-001",
    latitude: 10.775,
    longitude: 106.701,
    status: BinStatus.FULL,
    currentLevel: 95,
    collectionPointId: "cp-001",
    // ... các field khác nếu cần
  },
  {
    id: "bin-002",
    code: "BIN-Q1-002",
    latitude: 10.779,
    longitude: 106.699,
    status: BinStatus.ACTIVE,
    currentLevel: 30,
    collectionPointId: "cp-002",
  },
];
