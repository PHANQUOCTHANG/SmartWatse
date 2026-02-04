import { useState, useEffect } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { taskAssignmentApi } from "../api/taskApi";
import type { TaskFilterParams } from "../types";
import { taskKeys } from "../utils/taskKeys";
import { APP_CONFIG } from "@/config/constants";
import { CreateTaskFormValues } from "../schemas/task-assignment.schema";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";

// Helper để parse URL params
const getUrlParams = (): Partial<TaskFilterParams> => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get("page") || "1"),
    keyword: params.get("keyword") || undefined,
    status: params.get("status") || undefined,
    staffId: params.get("staffId") || undefined,
    scheduleId: params.get("scheduleId") || undefined,
    binId: params.get("binId") || undefined,
    areaId: params.get("areaId") || undefined,
    startDate: params.get("startDate") || undefined,
    endDate: params.get("endDate") || undefined,
  };
};

export const useTasks = (
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
  initialFilters?: Partial<TaskFilterParams>,
) => {
  // Khởi tạo state lọc từ URL
  const [filterParams, setFilterParams] = useState<TaskFilterParams>(() => ({
    page: 1,
    limit: initialLimit,
    keyword: "",
    status: undefined,
    staffId: undefined,
    scheduleId: undefined,
    binId: undefined,
    areaId: undefined,
    startDate: undefined,
    endDate: undefined,
    ...getUrlParams(),
    ...initialFilters,
  }));

  // Sync URL khi filterParams thay đổi
  useEffect(() => {
    const params = new URLSearchParams();

    if (filterParams.page && filterParams.page > 1) {
      params.set("page", filterParams.page.toString());
    }
    if (filterParams.keyword) params.set("keyword", filterParams.keyword);
    if (filterParams.status) params.set("status", filterParams.status);
    if (filterParams.staffId) params.set("staffId", filterParams.staffId);
    if (filterParams.scheduleId)
      params.set("scheduleId", filterParams.scheduleId);
    if (filterParams.binId) params.set("binId", filterParams.binId);
    if (filterParams.areaId) params.set("areaId", filterParams.areaId);
    if (filterParams.startDate) params.set("startDate", filterParams.startDate);
    if (filterParams.endDate) params.set("endDate", filterParams.endDate);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [filterParams]);

  // Lấy danh sách task với cache
  const { data, isLoading, isFetching } = useQuery({
    queryKey: taskKeys.list(filterParams),
    queryFn: () => taskAssignmentApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const updateFilter = (
    key: keyof TaskFilterParams,
    value: string | undefined,
  ) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const tasks = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT,
    totalPages: data?.totalPages || 0,
  };

  // Mutation tạo task
  const createMutation = useMutation({
    mutationFn: (payload: CreateTaskFormValues) =>
      taskAssignmentApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo nhiệm vụ thành công!");
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo task"),
  });

  // Mutation cập nhật task
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateTaskFormValues>;
    }) => taskAssignmentApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật nhiệm vụ thành công");
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật nhiệm vụ"),
  });

  // Mutation xóa task
  const deleteMutation = useMutation({
    mutationFn: taskAssignmentApi.delete,
    onSuccess: () => {
      toast.success("Xóa nhiệm vụ thành công");
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa nhiệm vụ"),
  });

  return {
    tasks,
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
