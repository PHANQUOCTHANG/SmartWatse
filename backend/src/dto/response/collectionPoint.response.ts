import { CollectionPointStatus } from "@/interface/collectionPoint.interface";

export interface CollectionPointResponse {
  id: string;
  name: string;
  code: string;
  image?: string;

  areaId: string;
  areaName?: string;

  address: string;
  capacity: number;
  status: CollectionPointStatus;

  latitude: number;
  longitude: number;

  createdAt: Date;
  updatedAt?: Date;
}
