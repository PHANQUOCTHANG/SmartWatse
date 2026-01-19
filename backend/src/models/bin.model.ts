import { Schema, model, Document } from "mongoose";
import { IBin, BinType, BinStatus } from "../interface/bin.interface";

export type IBinDocument = Omit<IBin, "_id"> & Document;

const binSchema = new Schema<IBinDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      trim: true,
    },

    collectionPointId: {
      type: Schema.Types.ObjectId,
      ref: "CollectionPoint",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: { type: String },

    binType: {
      type: String,
      enum: Object.values(BinType),
      required: true,
    },

    capacity: { type: Number, required: true },
    brand: { type: String },
    installationDate: { type: Date, default: Date.now },

    currentLevel: { type: Number, default: 0, min: 0, max: 100 },

    status: {
      type: String,
      enum: Object.values(BinStatus),
      default: BinStatus.ACTIVE,
    },

    battery: { type: Number, min: 0, max: 100, default: 100 },
    temperature: { type: Number },

    // --- MEDIA ---
    coverImage: { type: String, default: null },
    notes: { type: String },

    lastCollected: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

binSchema.index({ code: 1 }, { unique: true });
binSchema.index({ collectionPointId: 1 });
binSchema.index({ location: "2dsphere" });

binSchema.virtual("latitude").get(function () {
  return this.location.coordinates[1];
});

binSchema.virtual("longitude").get(function () {
  return this.location.coordinates[0];
});

export const Bin = model<IBinDocument>("Bin", binSchema);
