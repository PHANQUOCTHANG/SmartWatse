import { IBinLocation } from "@/features/map-monitor/types/types";
import api from "@/lib/axios";

export const mapApi = {
  // Lấy danh sách thùng rác (có thể truyền bounds để tối ưu tải trang)
  getBins: async (): Promise<IBinLocation[]> => {
    // Gọi endpoint BE: GET /api/v1/bins (hoặc /bins/nearby)
    const { data } = await api.get("/bins");
    return data.data; // Tùy cấu trúc response của BE
  },
};
