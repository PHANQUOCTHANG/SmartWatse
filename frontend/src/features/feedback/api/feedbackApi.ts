import api from "@/lib/axios";
import {
  IFeedback,
  FeedbackFilterParams,
  FeedbackListResponse,
  CreateFeedbackDTO,
  UpdateFeedbackDTO,
  FeedbackStats,
} from "../types";

const API_BASE = "/citizen-reports";

export const feedbackApi = {
  // Lấy danh sách phản ánh
  getAll: async (
    params: FeedbackFilterParams,
  ): Promise<FeedbackListResponse> => {
    const { data } = await api.get(API_BASE, { params });

    console.log("Data: ", data.data);
    return data.data;
  },

  // Lấy chi tiết phản ánh
  getById: async (id: string): Promise<IFeedback> => {
    const { data } = await api.get(`${API_BASE}/${id}`);
    return data.data;
  },

  // Tạo phản ánh mới
  create: async (payload: CreateFeedbackDTO): Promise<IFeedback> => {
    const { data } = await api.post(API_BASE, payload);
    return data.data;
  },

  // Cập nhật phản ánh
  update: async (
    id: string,
    payload: UpdateFeedbackDTO,
  ): Promise<IFeedback> => {
    const { data } = await api.patch(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  // Xóa phản ánh
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Lấy thống kê
  getStats: async (): Promise<FeedbackStats> => {
    const { data } = await api.get(`${API_BASE}/stats`);
    return data.data;
  },

  // Tìm kiếm phản ánh
  search: async (keyword: string): Promise<IFeedback[]> => {
    const { data } = await api.get(`${API_BASE}/search`, {
      params: { keyword },
    });
    return data.data;
  },

  // Cập nhật trạng thái
  updateStatus: async (id: string, status: string): Promise<IFeedback> => {
    const { data } = await api.patch(`${API_BASE}/${id}`, { status });
    return data.data;
  },
};
