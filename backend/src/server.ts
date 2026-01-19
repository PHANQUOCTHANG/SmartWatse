import "dotenv/config";
import "reflect-metadata";
import express, { Request, Response } from "express";
import clientRoute from "@/api/v1/routes/index.route";
import { connect } from "@/config/database";
import app from "@/app";
import { globalErrorHandler } from "@/middleware/errorHandler";
import { authService } from "@/config/container";
import { UserRole } from "@/interface/user.interface";

// constant .
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL || "";

// Kết nối database .
connect(DATABASE_URL);

// router .
clientRoute(app);

// global error .
app.use(globalErrorHandler);

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`⚡️ [server]: Máy chủ đang chạy tại http://localhost:${PORT}`);
});
