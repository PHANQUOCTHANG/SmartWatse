// src/middleware/uploadMiddleware.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // Import từ file bạn đã cấu hình

// 1. Cấu hình nơi lưu trữ (Storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "smart-waste-management", // Tên folder trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Định dạng cho phép
    // transformation: [{ width: 1000, height: 1000, crop: "limit" }], // (Optional) Resize ảnh luôn khi up
  } as any, // 'as any' để tránh lỗi type checking khắt khe của thư viện này
});

// 2. Cấu hình Multer (Upload Instance)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB (khớp với Frontend)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép upload file ảnh!"));
    }
  },
});

export default upload;
