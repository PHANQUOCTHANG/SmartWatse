import { useState, useEffect, useMemo } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { taskAssignmentApi } from "../api/taskApi";
import { taskKeys } from "../utils/taskKeys";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import type { TaskFilterParams, CreateTaskDTO } from "../types";

// Helper lấy params từ URL (giống hook cũ)
const getUrlParams = (): Partial<TaskFilterParams> => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get("page") || "1"),
    search: params.get("keyword") || undefined,
    status: params.get("status") || undefined,
    scheduleId: params.get("scheduleId") || undefined,
    startDate: params.get("startDate") || undefined,
    endDate: params.get("endDate") || undefined,
    // Không lấy staffId từ URL vì nó được truyền qua props
  };
};

export const useStaffTasks = (
  staffId: string | undefined, // StaffId là bắt buộc logic, nhưng có thể undefined lúc chờ load auth
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
) => {
  // 1. Khởi tạo state
  const [filterParams, setFilterParams] = useState<TaskFilterParams>(() => ({
    page: 1,
    limit: initialLimit,
    search: "",
    status: undefined,
    scheduleId: undefined,
    binId: undefined,
    areaId: undefined,
    startDate: undefined,
    endDate: undefined,
    ...getUrlParams(),
    staffIds: staffId ? [staffId] : undefined, // Khởi tạo với staffId
  }));
  console.log("Filter Params:", filterParams);
  // 2. Effect: Cập nhật filterParams khi staffId thay đổi (quan trọng)
  useEffect(() => {
    if (staffId) {
      setFilterParams((prev) => ({ ...prev, staffId }));
    }
  }, [staffId]);

  // 3. Effect: Sync URL (nhưng bỏ qua staffId trên URL để tránh lộ hoặc xung đột)
  useEffect(() => {
    const params = new URLSearchParams();
    if (typeof filterParams.page === "number" && filterParams.page > 1)
      params.set("page", filterParams.page.toString());
    if (filterParams.search) params.set("keyword", filterParams.search);
    if (filterParams.status) params.set("status", filterParams.status);
    if (filterParams.startDate) params.set("startDate", filterParams.startDate);
    if (filterParams.endDate) params.set("endDate", filterParams.endDate);

    // Giữ lại query params hiện tại của window để không mất context khác
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [filterParams]);

  // 4. Query Data
  const { data, isLoading, isFetching } = useQuery({
    queryKey: taskKeys.list(filterParams), // Key sẽ tự động đổi khi staffId trong filterParams đổi
    queryFn: () => taskAssignmentApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    enabled: !!staffId, // Chỉ fetch khi có staffId
    staleTime: 1000 * 30, // 30s
  });

  // 5. Handlers
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

  // 6. Meta Data
  const tasks = data?.data || [];
  const meta = useMemo(
    () => ({
      totalItems: data?.total || 0,
      page: data?.page || 1,
      pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT,
      totalPages: data?.totalPages || 0,
    }),
    [data],
  );

  // 7. Mutations (Chỉ giữ lại Update cho Staff)
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateTaskDTO>;
    }) => taskAssignmentApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật nhiệm vụ"),
  });

  return {
    // Data
    tasks,
    meta,

    // State & Setters
    filterParams,
    setFilterParams, // Expose để gắn vào Filter Component
    handlePageChange,
    handleSearch,
    updateFilter,

    // Status
    isLoading: isLoading || isFetching,
    isUpdating: updateMutation.isPending,

    // Actions
    updateTask: updateMutation.mutate, // Đổi tên cho ngữ nghĩa hơn
  };
};
