import { ReportStatus } from "../../interface/citizenReport.interface";
import { IUser } from "../../interface/user.interface";
import { IArea } from "../../interface/area.interface";
import { ICollectionPoint } from "../../interface/collectionPoint.interface";
import { IBin } from "../../interface/bin.interface";

export interface CitizenReportResponse {
  id: string;
  citizenId: IUser;
  areaId?: IArea;
  collectionPointId?: ICollectionPoint;
  binId?: IBin;
  description: string;
  imageUrls?: string[];
  status: ReportStatus;
  createdAt: Date;
}
