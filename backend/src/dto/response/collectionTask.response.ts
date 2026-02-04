import {
  ICollectionTask,
  TaskStatus,
} from "../../interface/collectionTask.interface";
import { IUser } from "../../interface/user.interface";
import { IBin } from "../../interface/bin.interface";
import { ICollectionSchedule } from "../../interface/collectionSchedule.interface";
import { IVehicle } from "../../interface/vehicle.interface";

export interface CollectionTaskResponse {
  id: string;

  // Trả về toàn bộ Object thay vì chỉ lấy ID
  schedule: ICollectionSchedule | null;

  // Trả về mảng chứa toàn bộ thông tin nhân viên
  staffs: IUser[];

  // Trả về thông tin xe thực hiện nhiệm vụ
  vehicle: IVehicle | null;

  // scheduledDate: Date;
  status: TaskStatus;
  note?: string;
  createdAt: Date;
}
