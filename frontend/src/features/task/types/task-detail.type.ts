export type BinStatus = "OVERLOAD" | "PENDING" | "COMPLETED";

export interface Bin {
  id: string;
  code: string;
  address: string;
  status: BinStatus;
  checkedInAt?: string;
}

export interface TaskRouteDetail {
  id: string;
  name: string;
  estimate: string;
  status: "IN_PROGRESS" | "PAUSED" | "DONE";
  progress: {
    current: number;
    total: number;
  };
  bins: Bin[];
}

export interface TaskBin {
  id: string;
  name: string;
  address: string;
  status: "OVERLOADED" | "PENDING" | "COMPLETED" | "INCIDENT";
}