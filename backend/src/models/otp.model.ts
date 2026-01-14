import { IOtp } from "@/interface/otp.interface";
import { Schema, model, Document } from "mongoose";


export interface IOtpDocument extends IOtp, Document {}

const otpSchema = new Schema<IOtpDocument>(
  {
    // Email dùng để gắn OTP (reset password)
    email: {
      type: String,
      required: true,
      index: true,
    },

    // OTP đã được hash (không lưu OTP plain)
    otpHash: {
      type: String,
      required: true,
    },

    // Thời điểm hết hạn OTP (TTL Index)
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB tự động xóa document sau khi đạt đến thời điểm expiresAt
      expires: 0,
    },

    // Đánh dấu OTP đã được xác thực (dùng cho bước đổi mật khẩu)
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "otps",
    versionKey: false,
  }
);

export const Otp = model<IOtpDocument>("Otp", otpSchema);
