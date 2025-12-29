import { Schema, model, Document } from "mongoose";
import { IUser, UserRole, UserStatus } from "../interface/user.interface";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    full_name: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    password_hash: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      maxlength: 255,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CITIZEN,
    },
    phone: { type: String, maxlength: 20 },
    area_id: { type: Number },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

userSchema.index({ email: 1 });

export const UserModel = model<IUserDocument>("User", userSchema);
