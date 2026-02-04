import { ReportStatus } from "../../interface/citizenReport.interface";
import { IUser } from "../../interface/user.interface";
import { IArea } from "../../interface/area.interface";
import { IBin } from "../../interface/bin.interface";

export interface CitizenReportResponse {
  id: string;
  citizenId: IUser;
  areaId?: IArea;
  binId?: IBin;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: Date;
}
