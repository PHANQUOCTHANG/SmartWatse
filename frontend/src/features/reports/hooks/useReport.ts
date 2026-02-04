import { useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { reportApi } from "../api/reportApi";
import type { ReportFilterParams } from "../types";
import { reportKeys } from "@/features/reports/utils/reportKeys";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

// ============ QUERY HOOKS ============

export const useCitizenReports = (
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
) => {
  const [filterParams, setFilterParams] = useState<ReportFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    status: undefined,
    citizenId: undefined,
    binId: undefined,
  });

  // HOOKS QUERY DATA
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: reportKeys.list(filterParams),
    queryFn: () => reportApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // Cache data 1 minute
  });

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const updateFilter = (key: keyof ReportFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const reports = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.totalPages || 0,
  };

  return {
    // Data
    reports,
    meta,
    isLoading,
    isFetching,
    error,
    filterParams,
    // Handlers
    handlePageChange,
    handleSearch,
    updateFilter,
  };
};

export const useCitizenReportDetail = (id: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============ MUTATION HOOKS ============

export const useCreateCitizenReport = () => {
  return useMutation({
    mutationFn: reportApi.create,
    onSuccess: (data) => {
      toast.success("Tạo báo cáo thành công");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      return data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Lỗi tạo báo cáo";
      toast.error(message);
    },
  });
};

export const useUpdateCitizenReport = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      reportApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật báo cáo thành công");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Lỗi cập nhật báo cáo";
      toast.error(message);
    },
  });
};

export const useDeleteCitizenReport = () => {
  return useMutation({
    mutationFn: reportApi.delete,
    onSuccess: () => {
      toast.success("Xóa báo cáo thành công");
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Lỗi xóa báo cáo";
      toast.error(message);
    },
  });
};
