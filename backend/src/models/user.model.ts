import { Schema, model, Document } from "mongoose";
import { IUser, UserRole, UserStatus } from "../interface/user.interface";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
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
    passwordHash: {
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
    areaId: { type: Number },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

userSchema.index({ email: 1 });

export const User = model<IUserDocument>("User", userSchema);
