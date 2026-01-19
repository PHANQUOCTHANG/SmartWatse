import { AreaFilterParams } from "../types";

export const areaKeys = {
  all: ["areas"] as const,
  lists: () => [...areaKeys.all, "list"] as const,
  list: (filter: AreaFilterParams) =>
    [...areaKeys.lists(), { filter }] as const,
  details: () => [...areaKeys.all, "detail"] as const,
  detail: (id: string) => [...areaKeys.details(), id] as const,
  // Key phụ: Dùng để fetch danh sách dropdown (ví dụ lấy tất cả Quận để chọn khi tạo Phường)
  dropdowns: () => [...areaKeys.all, "dropdown"] as const,
};
