import { Schema, model, Document } from "mongoose";
import { ICitizenReport, ReportStatus } from "../interface/citizenReport.interface";

export interface ICitizenReportDocument extends ICitizenReport, Document {}

const citizenReportSchema = new Schema<ICitizenReportDocument>(
  {
    citizenId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    binId: { type: Schema.Types.ObjectId, ref: "Bin" },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { 
      type: String, 
      enum: Object.values(ReportStatus), 
      default: ReportStatus.NEW 
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Index hỗ trợ truy vấn báo cáo theo trạng thái và người gửi
citizenReportSchema.index({ citizenId: 1, createdAt: -1 });
citizenReportSchema.index({ status: 1 });

export const CitizenReport = model<ICitizenReportDocument>("CitizenReport", citizenReportSchema);