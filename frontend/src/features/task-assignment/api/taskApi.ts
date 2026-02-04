import api from "@/lib/axios";
import { ITask, CreateTaskDTO, TaskFilterParams } from "../types";
import { PagedResponse } from "@/types";

export const taskAssignmentApi = {
  /** Lấy danh sách task với lọc & phân trang */
  getAll: async (params: TaskFilterParams): Promise<PagedResponse<ITask>> => {
    // Lấy ngày hiện tại địa phương định dạng YYYY-MM-DD
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const { data } = await api.get("/collection-tasks", {
      params: {
        ...params,
        startDate: params?.startDate !== undefined ? params.startDate : today, // Mặc định hôm nay nếu trống
      },
    });

    return data;
  },

  /** Lấy chi tiết task theo ID */
  getById: async (id: string): Promise<ITask> => {
    const { data } = await api.get(`/collection-tasks/${id}`);
    return data.data;
  },

  /** Tạo task mới */
  create: async (payload: CreateTaskDTO): Promise<ITask> => {
    console.log("API: Creating task with payload:", payload);
    const { data } = await api.post("/collection-tasks", payload);
    console.log("API: Task created successfully:", data);
    return data.data;
  },

  /** Cập nhật task */
  update: async (
    id: string,
    payload: Partial<CreateTaskDTO>,
  ): Promise<ITask> => {
    const { data } = await api.patch(`/collection-tasks/${id}`, payload);
    return data.data;
  },

  /** Xóa task */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/collection-tasks/${id}`);
  },

  /** Cập nhật hàng loạt task */
  bulkUpdate: async (
    ids: string[],
    updates: Partial<CreateTaskDTO>,
  ): Promise<void> => {
    await api.put("/collection-tasks/bulk", { ids, updates });
  },
};
