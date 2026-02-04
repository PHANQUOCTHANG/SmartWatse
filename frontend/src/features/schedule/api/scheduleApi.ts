import api from "@/lib/axios";
import { ISchedule, ScheduleFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { ScheduleFormValues } from "@/features/schedule/schemas/schedule.schema";

export const scheduleApi = {
  getAll: async (
    params: ScheduleFilterParams,
  ): Promise<PagedResponse<ISchedule>> => {
    const { data } = await api.get("/collection-schedules", { params });
    return data;
  },

  getById: async (id: string): Promise<ISchedule> => {
    const { data } = await api.get(`/collection-schedules/${id}`);
    return data.data;
  },

  create: async (payload: ScheduleFormValues): Promise<ISchedule> => {
    const { data } = await api.post("/collection-schedules", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<ScheduleFormValues>,
  ): Promise<ISchedule> => {
    const { data } = await api.patch(
      `/collection-schedules/${id}`,
      payload,
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/collection-schedules/${id}`);
  },
};
