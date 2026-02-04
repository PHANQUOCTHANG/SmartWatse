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

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: number; // km
  duration: number; // minutes
}

export interface VehiclePosition {
  id: string;
  plateNumber: string;
  lat: number;
  lng: number;
  status: string; // 'AVAILABLE' | 'IN_USE' | ...
  type?: string;
  lastUpdated?: string;
}
