import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { feedbackApi } from "../api/feedbackApi";
import type { FeedbackFilterParams } from "../types";
import { feedbackKeys } from "../utils/feedbackKeys";
import { APP_CONFIG } from "@/config/constants";
import { CreateFeedbackDTO, UpdateFeedbackDTO } from "../types";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useFeedbacks = (
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
  initialFilters?: Partial<FeedbackFilterParams>,
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterParams, setFilterParams] = useState<FeedbackFilterParams>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: initialLimit,
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || undefined,
    areaId: searchParams.get("areaId") || undefined,
    binId: searchParams.get("binId") || undefined,
    collectionPointId: searchParams.get("collectionPointId") || undefined,
    citizenId: searchParams.get("citizenId") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    ...initialFilters,
  });

  // Cập nhật URL khi filterParams thay đổi
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (filterParams.page && filterParams.page !== 1) {
      newSearchParams.set("page", String(filterParams.page));
    }
    if (filterParams.search) {
      newSearchParams.set("search", filterParams.search);
    }
    if (filterParams.status) {
      newSearchParams.set("status", filterParams.status);
    }
    if (filterParams.areaId) {
      newSearchParams.set("areaId", filterParams.areaId);
    }
    if (filterParams.binId) {
      newSearchParams.set("binId", filterParams.binId);
    }
    if (filterParams.collectionPointId) {
      newSearchParams.set("collectionPointId", filterParams.collectionPointId);
    }
    if (filterParams.citizenId) {
      newSearchParams.set("citizenId", filterParams.citizenId);
    }
    if (filterParams.startDate) {
      newSearchParams.set("startDate", filterParams.startDate);
    }
    if (filterParams.endDate) {
      newSearchParams.set("endDate", filterParams.endDate);
    }

    setSearchParams(newSearchParams);
  }, [filterParams, setSearchParams]);

  // Lấy danh sách phản ánh
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: feedbackKeys.list(filterParams),
    queryFn: () => feedbackApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (search: string) =>
    setFilterParams((prev) => ({ ...prev, search, page: 1 }));

  const updateFilter = (
    key: keyof FeedbackFilterParams,
    value: string | undefined,
  ) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilterParams({
      page: 1,
      limit: initialLimit,
      search: "",
      status: undefined,
      areaId: undefined,
      binId: undefined,
      collectionPointId: undefined,
      citizenId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const feedbacks = Array.isArray(data) ? data : data?.data || [];
  const meta = {
    totalItems: data?.pagination?.total || 0,
    page: data?.pagination?.page || 1,
    pageSize: data?.pagination?.limit || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.pagination?.pages || 0,
  };

  // Tạo phản ánh mới
  const createMutation = useMutation({
    mutationFn: (payload: CreateFeedbackDTO) => feedbackApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo phản ánh thành công!");
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
    onError: (error: Error) => {
      const message =
        (error as unknown as ErrorResponse)?.response?.data?.message ||
        "Lỗi tạo phản ánh";
      toast.error(message);
    },
  });

  // Cập nhật phản ánh
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeedbackDTO }) =>
      feedbackApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật phản ánh thành công!");
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
    onError: (error: Error) => {
      const message =
        (error as unknown as ErrorResponse)?.response?.data?.message ||
        "Lỗi cập nhật phản ánh";
      toast.error(message);
    },
  });

  // Xóa phản ánh
  const deleteMutation = useMutation({
    mutationFn: (id: string) => feedbackApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa phản ánh thành công!");
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
    onError: (error: Error) => {
      const message =
        (error as unknown as ErrorResponse)?.response?.data?.message ||
        "Lỗi xóa phản ánh";
      toast.error(message);
    },
  });

  // Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      feedbackApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
    },
    onError: (error: Error) => {
      const message =
        (error as unknown as ErrorResponse)?.response?.data?.message ||
        "Lỗi cập nhật trạng thái";
      toast.error(message);
    },
  });

  // Lấy chi tiết phản ánh
  const useGetFeedback = (id: string) =>
    useQuery({
      queryKey: feedbackKeys.detail(id),
      queryFn: () => feedbackApi.getById(id),
      enabled: !!id,
    });

  return {
    // Query states
    feedbacks,
    isLoading,
    isFetching,
    meta,
    filterParams,

    // Handlers
    handlePageChange,
    handleSearch,
    updateFilter,
    handleClearFilters,
    refetch,
    refreshFeedbacks: refetch,

    // Mutations
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    delete: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    // Queries
    useGetFeedback: useGetFeedback,
  };
};
