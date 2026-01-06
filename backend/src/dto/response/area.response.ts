import { AreaType } from "../../interface/area.interface";

export interface AreaResponse {
  id: string;
  name: string;
  type: AreaType;
  parentId?: number;
  createdAt: Date;
}