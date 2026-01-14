import { Types } from "mongoose";

export interface ICollectionPoint {
  name: string;
  areaId: Types.ObjectId; 
  latitude: number;
  longitude: number;
  createdAt: Date;
}