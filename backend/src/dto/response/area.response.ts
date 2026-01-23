import { AreaType } from "../../interface/area.interface";

export interface AreaResponse {
  id: string;
  name: string;
  type: AreaType;

  parentId?: string | { id: string; name: string } | null;

  boundary: number[][][];

  createdAt: Date;
}
