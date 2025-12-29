import 'reflect-metadata';
import express, { Request, Response } from "express";
import clientRoute from "@/api/v1/routes/index.route";
import { connect } from "@/config/database";
import { config } from "dotenv";
import app from "@/app";
import { globalErrorHandler } from "@/middleware/errorHandler";

config(); // load dữ liệu từ file env .

// constant .
const PORT = process.env.PORT || 5000;
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
