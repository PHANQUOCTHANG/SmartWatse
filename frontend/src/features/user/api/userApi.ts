import api from "@/lib/axios";
import { IUser, UserFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";
import { UserFormValues } from "@/features/user/schemas/user.schema";

export const userApi = {
  // 1. GET LIST (Phân trang & Search)
  getAll: async (params: UserFilterParams): Promise<PagedResponse<IUser>> => {
    // Backend trả về: { status: "success", data: [], total: ... }
    // Axios trả về: { data: { status, data, total... } }
    const { data } = await api.get("/users", { params });
    console.log(data);
    // Map response backend về format frontend cần
    return data;
  },

  // 2. GET DETAIL
  getById: async (id: string): Promise<IUser> => {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },

  // 3. CREATE (Multipart/Form-data)
  create: async (payload: UserFormValues): Promise<IUser> => {
    const formData = buildFormData(payload);

    const { data } = await api.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  // 4. UPDATE (Multipart/Form-data)
  update: async (id: string, payload: UserFormValues): Promise<IUser> => {
    // Nếu payload có avatar (File) thì dùng FormData
    // Nếu chỉ update text, dùng JSON cũng được, nhưng để đồng bộ ta dùng FormData luôn
    const formData = buildFormData(payload);

    const { data } = await api.patch(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  // 5. DELETE
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
