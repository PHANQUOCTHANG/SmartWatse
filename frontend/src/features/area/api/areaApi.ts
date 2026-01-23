import api from "@/lib/axios";
import { IArea, AreaFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { AreaFormValues } from "@/features/area/schemas/area.schema";

export const areaApi = {
  // 1. GET LIST
  getAll: async (params: AreaFilterParams): Promise<PagedResponse<IArea>> => {
    const { data } = await api.get("/areas", { params });
    return data; // Backend trả về { status: "success", data: [], ... } nên axios interceptor thường đã handle việc lấy data.data
    // Nếu chưa handle interceptor, bạn dùng: return data.data;
  },

  // 2. GET DETAIL
  getById: async (id: string): Promise<IArea> => {
    const { data } = await api.get(`/areas/${id}`);
    return data.data;
  },

  // 3. CREATE
  create: async (payload: AreaFormValues): Promise<IArea> => {
    console.log(payload, "edit");
    const { data } = await api.post("/areas", payload);
    return data.data;
  },

  // 4. UPDATE
  update: async (id: string, payload: AreaFormValues): Promise<IArea> => {
    console.log(payload);
    const { data } = await api.patch(`/areas/${id}`, payload);
    return data.data;
  },

  // 5. DELETE
  delete: async (id: string): Promise<void> => {
    await api.delete(`/areas/${id}`);
  },
};
