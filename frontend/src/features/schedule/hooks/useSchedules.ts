import { useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { scheduleApi } from "../api/scheduleApi";
import type { ScheduleFilterParams } from "../types";
import { scheduleKeys } from "../utils/scheduleKeys";
import { APP_CONFIG } from "@/config/constants";
import { ScheduleFormValues } from "@/features/schedule/schemas/schedule.schema";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";

export const useSchedules = (
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
  initialFilters?: Partial<ScheduleFilterParams>,
) => {
  const [filterParams, setFilterParams] = useState<ScheduleFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    district: undefined,
    frequency: undefined,
    startDate: undefined,
    ...initialFilters,
  });

  // Lấy danh sách lịch trình
  const { data, isLoading, isFetching } = useQuery({
    queryKey: scheduleKeys.list(filterParams),
    queryFn: () => scheduleApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const updateFilter = (key: keyof ScheduleFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const schedules = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.totalPages || 0,
  };

  // Tạo lịch trình mới
  const createMutation = useMutation({
    mutationFn: (payload: ScheduleFormValues) => scheduleApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo lịch trình thành công!");
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo lịch trình"),
  });

  // Cập nhật lịch trình
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ScheduleFormValues>;
    }) => scheduleApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật lịch trình thành công");
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // Xóa lịch trình
  const deleteMutation = useMutation({
    mutationFn: scheduleApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa lịch trình");
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa"),
  });

  return {
    schedules,
    meta,
    filterParams,
    setFilterParams,
    handlePageChange,
    handleSearch,
    updateFilter,

    // States
    isLoading: isLoading || isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
