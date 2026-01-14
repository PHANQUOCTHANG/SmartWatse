import { BinType, BinStatus } from "../../interface/bin.interface";

export interface BinResponse {
  id: string;
  code: string;
  collectionPointId: string;
  binType: BinType;
  capacity: number;
  currentLevel: number;
  status: BinStatus;
  lastCollected?: Date;
  createdAt: Date;
}
