import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "@/config/controllers/auth.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import {
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
} from "@/dto/request/auth.request";

const router = Router();

// URL: /api/auth/register
router
  .route("/register")
  .post(validationMiddleware(RegisterRequestDto), register);

// URL: /api/auth/login
router.route("/login").post(validationMiddleware(LoginRequestDto), login);

// URL: /api/auth/refresh
router.route("/refresh").post(refresh);

// URL: /api/auth/logout
router.route("/logout").post(logout);

// URL: /api/auth/send-otp
router.route("/forgot-password").post(sendOtp);

// URL: /api/auth/verify-otp
router.route("/verify-otp").post(verifyOtp);

// URL: /api/auth/reset-password
router
  .route("/reset-password")
  .post(validationMiddleware(ResetPasswordRequestDto), resetPassword);

export default router;
