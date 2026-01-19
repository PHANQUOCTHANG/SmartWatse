import { BinType, BinStatus } from "../../interface/bin.interface";

export interface BinResponse {
  id: string;
  code: string;

  // [UPDATE] Trả về tọa độ để Map vẽ Marker
  latitude: number;
  longitude: number;
  address?: string;

  collectionPointId: string;
  binType: BinType;
  capacity: number;
  currentLevel: number;
  status: BinStatus;
  lastCollected?: Date;
  createdAt: Date;
}
