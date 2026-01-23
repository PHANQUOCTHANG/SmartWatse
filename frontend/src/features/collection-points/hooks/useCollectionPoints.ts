import { useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import { APP_CONFIG } from "@/config/constants";

// Imports từ feature
import { collectionPointApi } from "../api/collectionPointApi";
import {
  CollectionPointFilterParams,
  UpdateCollectionPointDTO,
} from "../types";
import { collectionPointKeys } from "@/features/collection-points/utils/areaKeys";

export const useCollectionPoints = (
  initialLimit = APP_CONFIG.PAGINATION_LIMIT,
) => {
  // --- STATE: Bộ lọc ---
  const [filterParams, setFilterParams] = useState<CollectionPointFilterParams>(
    {
      page: 1,
      limit: initialLimit,
      search: "",
      areaId: undefined, // Mặc định lấy tất cả
      sort: "-createdAt",
    },
  );

  // --- A. QUERY: Lấy danh sách ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: collectionPointKeys.list(filterParams),
    queryFn: () => collectionPointApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Cache 5 phút (Dữ liệu tĩnh)
  });

  // --- Helpers ---
  const collectionPoints = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: initialLimit,
    totalPages: data?.totalPages || 0,
  };

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, search: keyword, page: 1 }));

  // Hàm lọc theo khu vực (Dùng cho Dropdown Area)
  const handleAreaFilter = (areaId: string | undefined) => {
    setFilterParams((prev) => ({
      ...prev,
      areaId: areaId === "all" ? undefined : areaId,
      page: 1,
    }));
  };

  // --- B. MUTATIONS ---

  // 1. Create
  const createMutation = useMutation({
    mutationFn: collectionPointApi.create,
    onSuccess: () => {
      toast.success("Thêm điểm tập kết thành công");
      queryClient.invalidateQueries({ queryKey: collectionPointKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi thêm điểm tập kết"),
  });

  // 2. Update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCollectionPointDTO;
    }) => collectionPointApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: collectionPointKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // 3. Delete
  const deleteMutation = useMutation({
    mutationFn: collectionPointApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa điểm tập kết");
      queryClient.invalidateQueries({ queryKey: collectionPointKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa"),
  });

  return {
    // Data
    collectionPoints,
    meta,
    filterParams,

    // Actions
    setFilterParams,
    handlePageChange,
    handleSearch,
    handleAreaFilter, // 👈 Dùng cái này ở UI Filter

    // Status
    isLoading: isLoading || isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,

    // Mutation Functions
    createCollectionPoint: createMutation.mutate,
    updateCollectionPoint: (id: string, payload: UpdateCollectionPointDTO) =>
      updateMutation.mutate({ id, payload }),
    deleteCollectionPoint: deleteMutation.mutate,
  };
};
