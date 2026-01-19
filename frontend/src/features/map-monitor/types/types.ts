export enum BinStatus {
  ACTIVE = "ACTIVE",
  FULL = "FULL",
  OVERLOAD = "OVERLOAD",
  BROKEN = "BROKEN",
}

export enum BinType {
  ORGANIC = "ORGANIC",
  INORGANIC = "INORGANIC",
  RECYCLE = "RECYCLE",
}

export interface IBinLocation {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  status: BinStatus;
  type: BinType;
  currentLevel: number; // 0-100
  address: string;
  lastCollected?: string;
}

export type MapFilterMode = "ALL" | "CRITICAL" | "FULL";
