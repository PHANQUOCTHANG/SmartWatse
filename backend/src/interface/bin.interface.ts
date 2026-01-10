import { Types } from "mongoose";

export enum BinType {
  ORGANIC = 'ORGANIC',
  INORGANIC = 'INORGANIC',
  RECYCLE = 'RECYCLE'
}

export enum BinStatus {
  NORMAL = 'NORMAL',
  FULL = 'FULL',
  OVERFLOW = 'OVERFLOW',
  BROKEN = 'BROKEN'
}

export interface IBin {
  code: string;
  collectionPointId: Types.ObjectId;
  binType: BinType;
  capacity: number;
  currentLevel: number;
  status: BinStatus;
  lastCollected?: Date;
  createdAt: Date;
}