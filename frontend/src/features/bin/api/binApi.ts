import api from "@/lib/axios";
import { IBin, BinFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { BinFormValues } from "@/features/bin/schemas/bin.schema";
import { buildFormData } from "@/utils/form-data";
export const binApi = {
  getAll: async (params: BinFilterParams): Promise<PagedResponse<IBin>> => {
    const { data } = await api.get("/bins", { params });
    return data;
  },

  getById: async (id: string): Promise<IBin> => {
    const { data } = await api.get(`/bins/${id}`);
    return data.data;
  },

  create: async (data: BinFormValues): Promise<IBin> => {
    const formData = buildFormData(data);
    console.log(formData);
    return api.post("/bins", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: async (id: string, data: Partial<BinFormValues>): Promise<IBin> => {
    const formData = buildFormData(data);
    return api.patch(`/bins/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bins/${id}`);
  },
};
