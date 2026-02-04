import { Schema, model, Document, Types } from "mongoose";
import { IUser, UserRole, UserStatus } from "../interface/user.interface";

// Document interface kế thừa IUser nhưng override các field cần thiết của Mongoose
export interface IUserDocument extends Omit<IUser, "id">, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      maxlength: 100,
      trim: true,
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
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CITIZEN,
    },

    phone: { type: String, maxlength: 20 },

    address: { type: String, maxlength: 255 },
    avatar: { type: String },

    // 🔥 [FIX] AreaId dùng ObjectId, ref sang collection 'Area'
    areaId: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  {
    versionKey: false,
    timestamps: true, // Tự động tạo createdAt, updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete (ret as any)._id; // Xóa _id, dùng id (virtual)
        delete (ret as any).passwordHash; // Đảm bảo không bao giờ lộ password
      },
    },
  },
);

userSchema.index({ email: 1 });

export const User = model<IUserDocument>("User", userSchema);
