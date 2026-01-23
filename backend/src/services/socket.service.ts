import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ISocketService } from "@/interface/socket.interface";

export class SocketService implements ISocketService {
  private io: SocketIOServer | null = null;

  // Cấu hình CORS cho Socket (Nên lấy từ biến môi trường)
  private readonly corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Domain Frontend
    methods: ["GET", "POST"],
    credentials: true,
  };

  init(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: this.corsOptions,
      pingInterval: 10000, // Ping mỗi 10s để giữ kết nối ổn định
      pingTimeout: 5000,
      transports: ["websocket", "polling"], // Ưu tiên Websocket
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Logic Join Room (Frontend gửi sự kiện join-room)
      socket.on("join-room", (room: string) => {
        socket.join(room);
        console.log(`👤 Socket ${socket.id} joined room: ${room}`);
      });

      socket.on("leave-room", (room: string) => {
        socket.leave(room);
      });

      socket.on("disconnect", () => {
        // console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  emit(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  emitToRoom(room: string, event: string, data: any): void {
    this.io?.to(room).emit(event, data);
  }

  // Tối ưu cho Realtime GPS: Nếu mạng lag, bỏ qua gói tin cũ, không gửi lại
  emitVolatile(room: string, event: string, data: any): void {
    this.io?.to(room).volatile.emit(event, data);
  }
}
