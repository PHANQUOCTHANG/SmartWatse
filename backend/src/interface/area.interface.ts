import { Types } from "mongoose";

export enum AreaType {
  DISTRICT = "DISTRICT",
  WARD = "WARD",
}

export interface IArea {
  name: string;
  type: AreaType;

  parentId?: string | Types.ObjectId | null;

  createdAt: Date;
}
