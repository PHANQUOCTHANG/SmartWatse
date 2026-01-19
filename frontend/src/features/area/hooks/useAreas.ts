import { useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { areaApi } from "../api/areaApi";
import { AreaFilterParams, UpdateAreaDTO } from "../types";
import { areaKeys } from "../utils/areaKeys";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";

export const useAreas = (initialLimit = APP_CONFIG.PAGINATION_LIMIT) => {
  // --- STATE: Bộ lọc ---
  const [filterParams, setFilterParams] = useState<AreaFilterParams>({
    page: 1,
    limit: initialLimit,
    search: "",
    type: undefined,
    parentId: undefined,
  });

  // --- A. QUERY: Lấy danh sách ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: areaKeys.list(filterParams),
    queryFn: () => areaApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Cache 5 phút vì Area ít thay đổi
  });

  // --- Helpers ---
  const areas = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT, // Lưu ý backend bạn trả về limit hay pageSize
    totalPages: data?.totalPages || 0,
  };

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, search: keyword, page: 1 }));

  const handleFilterChange = (key: keyof AreaFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  // --- B. MUTATION: Create ---
  const createMutation = useMutation({
    mutationFn: areaApi.create,
    onSuccess: () => {
      toast.success("Tạo khu vực thành công");
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo khu vực"),
  });

  // --- C. MUTATION: Update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAreaDTO }) =>
      areaApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật khu vực thành công");
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- D. MUTATION: Delete ---
  const deleteMutation = useMutation({
    mutationFn: areaApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa khu vực");
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa khu vực"),
  });

  return {
    // Data
    areas,
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

    // Mutations
    createArea: createMutation.mutate,
    updateArea: (id: string, payload: UpdateAreaDTO) =>
      updateMutation.mutate({ id, payload }),
    deleteArea: deleteMutation.mutate,
  };
};
// ... (Các import cũ giữ nguyên)
import { AreaType } from "../types"; // Import thêm AreaType

// ... (Hook useAreas giữ nguyên)

// --- HOOK MỚI: Lấy danh sách Quận để làm Parent cho Dropdown ---
export const useParentAreas = () => {
  return useQuery({
    // Key riêng cho dropdown để tránh lẫn với list chính
    queryKey: areaKeys.dropdowns(),

    // Gọi API lấy tất cả các khu vực là DISTRICT
    // Lưu ý: Đặt limit lớn (VD: 100) để lấy hết quận, hoặc backend cần api select-all riêng
    queryFn: () => areaApi.getAll({ type: AreaType.DISTRICT, limit: 100 }),

    // Transform data ngay tại đây để component chỉ việc map ra Option
    select: (data) =>
      data.data.map((area) => ({
        label: area.name,
        value: area.id,
      })),

    // Cache lâu hơn (10 phút) vì danh sách Quận ít khi thay đổi
    staleTime: 1000 * 60 * 10,
  });
};
