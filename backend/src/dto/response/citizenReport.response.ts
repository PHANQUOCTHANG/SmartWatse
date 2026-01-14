import { ReportStatus } from "../../interface/citizenReport.interface";

export interface CitizenReportResponse {
  id: string;
  citizenId: string;
  binId?: string;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: Date;
}