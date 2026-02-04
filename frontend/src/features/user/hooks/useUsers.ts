import { useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { UserFilterParams } from "../types";
import { userKeys } from "../utils/userKeys";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import { UserFormValues } from "@/features/user/schemas/user.schema";

export const useUsers = (initialLimit = APP_CONFIG.PAGINATION_LIMIT) => {
  // --- STATE: Bộ lọc ---
  const [filterParams, setFilterParams] = useState<UserFilterParams>({
    page: 1,
    limit: initialLimit,
    search: "", // map với keyword
    role: undefined,
    sort: "-createdAt",
  });
  console.log(filterParams);
  // --- A. QUERY: Lấy danh sách Users ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: userKeys.list(filterParams),

    queryFn: () => userApi.getAll(filterParams),

    // Giữ data cũ khi chuyển trang để tránh layout shift (giật trang)
    placeholderData: keepPreviousData,

    // Cache data 5 phút (tùy chỉnh theo business logic)
    staleTime: 1000 * 60 * 5,
  });

  // --- HELPER: Xử lý thay đổi bộ lọc ---
  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, search: keyword, page: 1 }));

  const updateFilter = (key: keyof UserFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1, // Reset về trang 1 khi đổi filter
    }));
  };

  // --- DATA TRANSFORMATION ---
  const users = data?.data || [];
  const meta = {
    totalItems: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.results || APP_CONFIG.PAGINATION_LIMIT, // Dùng limit từ response hoặc config
    totalPages: data?.totalPages || 0,
  };

  // --- B. MUTATION: Tạo mới ---
  const createMutation = useMutation({
    mutationFn: (payload: UserFormValues) => userApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công!");
      // Invalidate cache để load lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo người dùng"),
  });

  // --- C. MUTATION: Cập nhật ---
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserFormValues }) =>
      userApi.update(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- D. MUTATION: Xóa ---
  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa người dùng");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa người dùng"),
  });

  return {
    // Data
    users,
    meta,
    filterParams,

    // Actions
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

    // Mutation Functions
    createUser: (data: UserFormValues, options?: any) =>
      createMutation.mutate(data, options),

    updateUser: (id: string, payload: UserFormValues, options?: any) =>
      updateMutation.mutate({ id, payload }, options),

    deleteUser: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),
  };
};
