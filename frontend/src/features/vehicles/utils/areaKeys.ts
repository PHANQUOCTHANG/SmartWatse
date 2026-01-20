import { VehicleFilterParams } from "../types";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filter: VehicleFilterParams) =>
    [...vehicleKeys.lists(), { filter }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  // Key riêng cho Map (nếu cần fetch toàn bộ xe để vẽ map mà ko phân trang)
  mapLocations: () => [...vehicleKeys.all, "map"] as const,
};
