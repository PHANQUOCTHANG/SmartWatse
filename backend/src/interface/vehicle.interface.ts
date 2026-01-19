export enum VehicleStatus {
  AVAILABLE = "AVAILABLE", // Sẵn sàng
  IN_USE = "IN_USE", // Đang đi thu gom
  FULL = "FULL", // Đã đầy rác -> Cần về bãi
  MAINTENANCE = "MAINTENANCE", // Bảo trì
  OFFLINE = "OFFLINE", // Mất kết nối GPS
}

export enum VehicleType {
  COMPACTOR = "COMPACTOR", // Xe ép rác
  TRUCK = "TRUCK", // Xe tải thùng hở
  ELECTRIC = "ELECTRIC", // Xe điện nhỏ
}

export interface IVehicle {
  plateNumber: string;
  type: VehicleType;
  capacity: number; // Tổng tải trọng (kg hoặc m3)
  currentLoad: number; // Tải trọng hiện tại (được update từ cảm biến cân hoặc ước lượng)
  fuelLevel: number; // % nhiên liệu/pin
  status: VehicleStatus;

  // 🔥 Quan trọng: Vị trí địa lý (GeoJSON)
  location: {
    type: "Point";
    coordinates: [number, number]; // [Longitude, Latitude]
    lastUpdated: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}
