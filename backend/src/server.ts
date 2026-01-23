import "dotenv/config";
import "reflect-metadata";
import { createServer } from "http"; // 1. Import HTTP
import clientRoute from "@/api/v1/routes/index.route";
import { connect } from "@/config/database";
import app from "@/app";
import { globalErrorHandler } from "@/middleware/errorHandler";
import { socketService } from "@/config/container"; // 2. Import socketService

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || "";

// Kết nối database
connect(DATABASE_URL);

// Router
clientRoute(app);

// Global Error Handler
app.use(globalErrorHandler);

// --- THAY ĐỔI TỪ ĐÂY ---

// 3. Tạo HTTP Server bọc lấy Express App
const httpServer = createServer(app);

// 4. Khởi tạo Socket.io gắn vào httpServer
socketService.init(httpServer);

// 5. Lắng nghe bằng httpServer (KHÔNG dùng app.listen nữa)
httpServer.listen(PORT, () => {
  console.log(
    `⚡️ [server]: Máy chủ HTTP & Socket đang chạy tại http://localhost:${PORT}`,
  );
});
