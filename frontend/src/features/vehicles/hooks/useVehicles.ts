import { useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";

import { VehicleFilterParams, VehicleStatus } from "../types";

import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import { vehicleKeys } from "@/features/vehicles/utils/areaKeys";
import { vehicleApi } from "@/features/vehicles/api/vehicleApi.ts";
import { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";

export const useVehicles = (initialLimit = APP_CONFIG.PAGINATION_LIMIT) => {
  // --- STATE: Bộ lọc ---
  const [filterParams, setFilterParams] = useState<VehicleFilterParams>({
    page: 1,
    limit: initialLimit,
    search: "",
    status: undefined,
    type: undefined,
    sort: "-createdAt",
  });

  // --- A. QUERY: Lấy danh sách ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: vehicleKeys.list(filterParams),
    queryFn: () => vehicleApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // 30s refresh 1 lần (vì xe có thể đổi trạng thái/vị trí)
  });

  // --- Helpers ---
  const vehicles = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.totalPages || 0,
  };

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, search: keyword, page: 1 }));

  const handleFilterChange = (key: keyof VehicleFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  // --- B. MUTATION: Create ---
  const createMutation = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => {
      toast.success("Thêm phương tiện thành công");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo phương tiện"),
  });

  // --- C. MUTATION: Update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VehicleFormValues }) =>
      vehicleApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- D. MUTATION: Delete ---
  const deleteMutation = useMutation({
    mutationFn: vehicleApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa phương tiện");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa phương tiện"),
  });

  return {
    // Data
    vehicles,
    meta,
    filterParams,

    // Actions
    setFilterParams,
    handlePageChange,
    handleSearch,
    handleFilterChange,

    // Status
    isLoading: isLoading || isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    // Mutation Functions
    createVehicle: createMutation.mutate,
    updateVehicle: (id: string, payload: VehicleFormValues) =>
      updateMutation.mutate({ id, payload }),
    deleteVehicle: deleteMutation.mutate,
  };
};
export const useVehicleOptions = (status?: VehicleStatus) => {
  return useQuery({
    queryKey: [...vehicleKeys.all, "options", status],
    queryFn: () =>
      vehicleApi.getAll({
        status: status || VehicleStatus.AVAILABLE, // Mặc định chỉ lấy xe rảnh
        limit: 100,
      }),
    select: (data) =>
      data.data.map((v) => ({
        label: `${v.plateNumber} (${v.capacity}kg)`,
        value: v.id,
        original: v,
      })),
  });
};
