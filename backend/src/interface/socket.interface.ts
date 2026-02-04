import { Server } from "http";

export interface ISocketService {
  // Khởi tạo Socket Server gắn với HTTP Server
  init(httpServer: Server): void;

  // Gửi sự kiện đến TẤT CẢ client
  emit(event: string, data: any): void;

  // Gửi sự kiện đến một ROOM cụ thể (Ví dụ: Area_01)
  emitToRoom(room: string, event: string, data: any): void;

  // Gửi sự kiện "Volatile" (Không quan trọng việc mất gói tin - Dùng cho GPS liên tục)
  emitVolatile(room: string, event: string, data: any): void;
}
