import api from "@/lib/axios";
import { IBin, BinFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { BinFormValues } from "@/features/bin/schemas/bin.schema";

export const binApi = {
  getAll: async (params: BinFilterParams): Promise<PagedResponse<IBin>> => {
    const { data } = await api.get("/bins", { params });
    return data;
  },

  getById: async (id: string): Promise<IBin> => {
    const { data } = await api.get(`/bins/${id}`);
    return data.data;
  },

  create: async (payload: BinFormValues): Promise<IBin> => {
    const { data } = await api.post("/bins", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<BinFormValues>,
  ): Promise<IBin> => {
    const { data } = await api.patch(`/bins/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bins/${id}`);
  },
};
