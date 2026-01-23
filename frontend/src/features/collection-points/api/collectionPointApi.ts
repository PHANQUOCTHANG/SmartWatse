import api from "@/lib/axios";
import { PagedResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";
import { ICollectionPoint, CollectionPointFilterParams } from "../types";
import { CollectionPointFormValues } from "../schemas/collectionPoint.schema";

export const collectionPointApi = {
  // 1. GET LIST
  getAll: async (
    params: CollectionPointFilterParams,
  ): Promise<PagedResponse<ICollectionPoint>> => {
    const { data } = await api.get("/collection-points", { params });
    console.log(data);
    return data;
  },

  // 2. GET DETAIL
  getById: async (id: string): Promise<ICollectionPoint> => {
    const { data } = await api.get(`/collection-points/${id}`);
    return data.data;
  },

  // 3. CREATE (Có xử lý FormData để upload ảnh)
  create: async (
    data: CollectionPointFormValues,
  ): Promise<ICollectionPoint> => {
    // Tự động chuyển Object/File thành FormData
    const formData = buildFormData(data);

    // Gửi request
    const response = await api.post("/collection-points", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  },

  // 4. UPDATE (Có xử lý FormData)
  update: async (
    id: string,
    data: Partial<CollectionPointFormValues>,
  ): Promise<ICollectionPoint> => {
    // Tự động chuyển Object/File thành FormData
    const formData = buildFormData(data);

    const response = await api.patch(`/collection-points/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  },

  // 5. DELETE
  delete: async (id: string): Promise<void> => {
    await api.delete(`/collection-points/${id}`);
  },
};
