import { Types } from "mongoose";

export interface ICollectionSchedule {
  areaId: Types.ObjectId;      // Khu vực cần thu gom
  vehicleId: Types.ObjectId;   // Xe được điều động
  scheduledDate: Date;         // Ngày dự kiến thực hiện
  createdAt: Date;
}