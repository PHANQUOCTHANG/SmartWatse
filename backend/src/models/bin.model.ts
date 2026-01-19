import { Schema, model, Document } from "mongoose";
import { IBin, BinType, BinStatus } from "../interface/bin.interface";

export type IBinDocument = Omit<IBin, "_id"> & Document;

const binSchema = new Schema<IBinDocument>(
  {
    code: { type: String, required: true, unique: true, maxlength: 50, trim: true },
    
    collectionPointId: {
      type: Schema.Types.ObjectId,
      ref: "CollectionPoint",
      required: true,
    },

    // --- GEO LOCATION (Giữ nguyên chuẩn GeoJSON của bạn) ---
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [Longitude, Latitude] - Kinh độ trước, Vĩ độ sau
        required: true,
      },
    },
    address: { type: String },

    // --- PROPERTIES ---
    binType: { 
      type: String, 
      enum: Object.values(BinType), // ORGANIC, INORGANIC, RECYCLE
      required: true 
    },
    
    capacity: { type: Number, required: true }, // Dung tích (Lít)
    brand: { type: String }, // [NEW] Hãng sản xuất
    installationDate: { type: Date, default: Date.now }, // [NEW] Ngày lắp đặt

    // --- IOT STATUS (Đồng bộ với Zod Schema) ---
    currentLevel: { type: Number, default: 0, min: 0, max: 100 },
    
    status: {
      type: String,
      enum: Object.values(BinStatus), // ACTIVE, FULL, OVERLOAD, BROKEN...
      default: BinStatus.ACTIVE, // Hoặc ACTIVE tùy enum của bạn
    },

    battery: { type: Number, min: 0, max: 100, default: 100 }, // [NEW] % Pin
    temperature: { type: Number }, // [NEW] Nhiệt độ cảm biến (Cảnh báo cháy)

    // --- MEDIA ---
    coverImage: { type: String, default: null }, // [NEW] URL ảnh hiện trạng
    notes: { type: String }, // [NEW] Ghi chú thêm

    lastCollected: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true, // Tự động tạo createdAt, updatedAt
    toJSON: { virtuals: true }, // Để khi trả về JSON có kèm các trường ảo
    toObject: { virtuals: true }
  }
);

// --- INDEXES ---
binSchema.index({ code: 1 }, { unique: true });
binSchema.index({ collectionPointId: 1 });
binSchema.index({ location: "2dsphere" }); // QUAN TRỌNG NHẤT CHO MAP

// --- VIRTUALS (Tiện ích) ---
// Giúp Frontend lấy lat/long dễ hơn thay vì phải chọc vào mảng coordinates
binSchema.virtual('latitude').get(function() {
  return this.location.coordinates[1];
});

binSchema.virtual('longitude').get(function() {
  return this.location.coordinates[0];
});

export const Bin = model<IBinDocument>("Bin", binSchema);