import api from "@/lib/axios";
import { ICitizenReport, ReportFilterParams } from "../types";
import { CitizenReportFormValues } from "@/features/reports/schemas/report.schema";

interface CitizenReportsResponse {
  data: ICitizenReport[];
  total: number;
  page: number;
  results: number;
  totalPages: number;
}

export const reportApi = {
  getAll: async (
    params: ReportFilterParams,
  ): Promise<CitizenReportsResponse> => {
    const { data } = await api.get("/citizen-reports", { params });
    return data;
  },

  getById: async (id: string): Promise<ICitizenReport> => {
    const { data } = await api.get(`/citizen-reports/${id}`);
    return data.data;
  },

  create: async (payload: CitizenReportFormValues): Promise<ICitizenReport> => {
    const { data } = await api.post("/citizen-reports", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<CitizenReportFormValues>,
  ): Promise<ICitizenReport> => {
    const { data } = await api.patch(`/citizen-reports/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/citizen-reports/${id}`);
  },
};
