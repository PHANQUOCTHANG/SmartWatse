import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/features/area/api/areaApi";
import { areaKeys } from "@/features/area/utils/areaKeys";

/**
 * Hook để lấy danh sách khu vực cho task assignment filter
 */
export const useTaskAreas = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: areaKeys.list({ limit: 100 }),
    queryFn: () => areaApi.getAll({ limit: 100 }),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });

  return {
    areas: data?.data || [],
    isLoading,
    error,
  };
};
