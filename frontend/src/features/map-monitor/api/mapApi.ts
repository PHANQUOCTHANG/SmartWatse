import { areaApi } from "@/features/area/api/areaApi";
import { binApi } from "@/features/bin";
import { collectionPointApi } from "@/features/collection-points/api/collectionPointApi";

import { vehicleApi } from "@/features/vehicles/api/vehicleApi.ts";

export const mapService = {
  getAreas: async () => {
    const res = await areaApi.getAll({ limit: 1000 });
    return res;
  },
  getPoints: async () => {
    const res = await collectionPointApi.getAll({ limit: 1000 });
    return res;
  },
  getBins: async () => {
    const res = await binApi.getAll({ limit: 1000 });
    return res;
  },
  getVehicles: async () => {
    const res = await vehicleApi.getAll({ limit: 1000 });
    return res;
  },
};
