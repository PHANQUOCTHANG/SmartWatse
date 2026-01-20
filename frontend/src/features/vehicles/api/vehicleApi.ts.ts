import api from "@/lib/axios";
import { IVehicle, VehicleFilterParams } from "../types";
import { PagedResponse } from "@/types";
import { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";

export const vehicleApi = {
  // 1. GET LIST
  getAll: async (
    params: VehicleFilterParams,
  ): Promise<PagedResponse<IVehicle>> => {
    const { data } = await api.get("/vehicles", { params });
    return data;
  },

  // 2. GET DETAIL
  getById: async (id: string): Promise<IVehicle> => {
    const { data } = await api.get(`/vehicles/${id}`);
    return data.data;
  },

  // 3. CREATE
  create: async (payload: VehicleFormValues): Promise<IVehicle> => {
    const { data } = await api.post("/vehicles", payload);
    return data.data;
  },

  // 4. UPDATE
  update: async (id: string, payload: VehicleFormValues): Promise<IVehicle> => {
    const { data } = await api.patch(`/vehicles/${id}`, payload);
    return data.data;
  },

  // 5. DELETE
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};
