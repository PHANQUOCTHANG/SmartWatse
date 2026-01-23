import { IBin } from "@/features/bin";
import { IVehicle, VehicleStatus } from "@/features/vehicles/types";

// 1. Sự kiện Server gửi xuống Client (Frontend Lắng nghe - Listen)
export interface ServerToClientEvents {
  // --- VEHICLE EVENTS (Xe) ---

  /** Khi Admin thêm xe mới -> Map hiện marker ngay */
  "vehicle:created": (data: IVehicle) => void;

  /** 🔥 Quan trọng nhất: Xe di chuyển (Gửi liên tục) */
  "vehicle:moved": (data: {
    id: string;
    lat: number;
    lng: number;
    heading: number; // Góc quay để xoay icon xe
    status: VehicleStatus; // Để đổi màu icon nếu cần
  }) => void;

  /** Khi thông tin xe thay đổi (xăng, tải trọng, trạng thái) */
  "vehicle:updated": (data: IVehicle) => void;

  /** Khi xe bị xóa khỏi hệ thống */
  "vehicle:deleted": (data: { id: string }) => void;

  // --- BIN EVENTS (Thùng rác) ---

  /** Khi thêm thùng rác mới */
  "bin:created": (data: IBin) => void;

  /** Khi cảm biến gửi dữ liệu mới (Đầy/Vơi/Pin yếu) */
  "bin:updated": (data: IBin) => void;

  /** Khi xóa thùng rác */
  "bin:deleted": (data: { id: string }) => void;

  /** 🚨 CẢNH BÁO KHẨN CẤP (Hiện Toast/Popup đỏ) */
  "bin:alert": (data: {
    id: string;
    type: "FULL" | "MAINTENANCE" | "FIRE" | "OFFLINE";
    message: string;
    location: { lat: number; lng: number };
  }) => void;
}

// 2. Sự kiện Client gửi lên Server (Frontend Phát đi - Emit)
export interface ClientToServerEvents {
  /** * Client xin vào phòng theo Khu vực (Area).
   * VD: Admin Quận 1 chỉ join room "AREA_Quan1" để không nhận tin rác của Quận khác.
   */
  "join-room": (roomName: string) => void;

  /** Rời phòng (Khi chuyển trang hoặc logout) */
  "leave-room": (roomName: string) => void;
}
