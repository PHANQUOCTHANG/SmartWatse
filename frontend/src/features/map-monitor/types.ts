export type BinStatus = "EMPTY" | "NEARLY_FULL" | "OVERFLOW";

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number;
  status: BinStatus;
  address: string;
}
