import api from "@/lib/axios";
import type {
  StartShiftPayload,
  EndShiftPayload,
  ShiftFilterParams,
  IShift,
  PagedShifts,
} from "../types";

export const shiftApi = {
  getCurrent: async (): Promise<IShift | null> => {
    const { data } = await api.get("/shifts/current");
    return data.data || null;
  },

  startShift: async (payload: StartShiftPayload): Promise<IShift> => {
    const { data } = await api.post("/shifts/start", payload);
    return data.data;
  },

  endShift: async (id: string, payload: EndShiftPayload): Promise<IShift> => {
    const { data } = await api.post(`/shifts/${id}/end`, payload);
    return data.data;
  },

  getAll: async (params: ShiftFilterParams): Promise<PagedShifts> => {
    const { data } = await api.get("/shifts", { params });
    return data;
  },

  getById: async (id: string): Promise<IShift> => {
    const { data } = await api.get(`/shifts/${id}`);
    return data.data;
  },
};
