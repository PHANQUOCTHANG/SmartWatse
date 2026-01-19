import { useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { binApi } from "../api/binApi";
import type { BinFilterParams } from "../types";
import { binKeys } from "@/features/bin/utils/binKeys";
import { APP_CONFIG } from "@/config/constants";
import { BinFormValues } from "@/features/bin/schemas/bin.schema";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";

export const useBins = (initialLimit = APP_CONFIG.PAGINATION_LIMIT) => {
  const [filterParams, setFilterParams] = useState<BinFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    type: undefined,
    status: undefined,
  });
  // HOOKS QUERY DATA
  const { data, isLoading, isFetching } = useQuery({
    // 🔥 FIX KEY: ['tracks', 'list', { filter: ... }]
    queryKey: binKeys.list(filterParams),

    queryFn: () => binApi.getAll(filterParams),

    placeholderData: keepPreviousData,

    // Cache data 1 phút
    staleTime: 1000 * 60,
  });
  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const updateFilter = (key: keyof BinFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };
  const bins = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.total || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.totalPages || 0,
  };
  // HOOKS MUTATION
  const createMutation = useMutation({
    mutationFn: (payload: BinFormValues) => binApi.create(payload),
    onSuccess: () => {
      toast.success("Upload bài hát thành công! Đang xử lý nền...");
      // Refresh list
      queryClient.invalidateQueries({ queryKey: binKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi upload"),
  });

  // --- B. UPDATE ---
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BinFormValues>;
    }) => binApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: binKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- C. DELETE ---
  const deleteMutation = useMutation({
    mutationFn: binApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa bài hát");
      queryClient.invalidateQueries({ queryKey: binKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa"),
  });

  return {
    bins,
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
    createBin: (data: BinFormValues, options?: any) =>
      createMutation.mutate(data, options),

    updateBin: (id: string, payload: Partial<BinFormValues>, options?: any) =>
      updateMutation.mutate({ id, payload }, options),

    deleteBin: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),
  };
};
