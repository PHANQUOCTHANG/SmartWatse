import { useQuery } from "@tanstack/react-query";
import { taskAssignmentApi } from "../api/taskApi";
import { useAppSelector } from "@/store/hooks";
import { TaskStatus } from "../types";
import { HistoryFilterParams } from "../components/StaffTaskHistoryFilter";

export const useStaffHistory = (params: HistoryFilterParams) => {
  const { user } = useAppSelector((state) => state.auth);

  // 1. Xử lý Logic Status
  // Nếu chọn "ALL", ta cần lấy cả DONE và CANCELLED.
  // Hầu hết các thư viện HTTP (Axios) và Backend chuẩn sẽ nhận Mảng [] cho phép lọc nhiều giá trị (IN operator).
  const targetStatus =
    params.status === "ALL"
      ? [TaskStatus.DONE, TaskStatus.CANCELLED]
      : params.status;

  // 2. Chuẩn bị params gọi API
  // Sử dụng 'as any' nếu TypeScript báo lỗi do interface cũ chỉ khai báo string
  const queryParams: any = {
    staffId: user?.id ? user.id : undefined,
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    status: targetStatus,
    startDate: params.date ? params.date.toISOString() : undefined,
  };

  const { data, isLoading, refetch } = useQuery({
    // QueryKey thay đổi theo params -> Tự động refetch
    queryKey: ["staff-history", user?.id, queryParams],
    queryFn: () => taskAssignmentApi.getAll(queryParams),
    enabled: !!user?.id,
    // Giữ data cũ khi chuyển trang để UI không bị nháy (nếu dùng React Query v4)
    keepPreviousData: true,
    // Nếu dùng React Query v5, hãy đổi thành: placeholderData: (prev) => prev
  });

  // 3. Tính toán thống kê (Stats)
  // Lưu ý: data?.data có thể trả về mixed status, cần filter chính xác để đếm
  const historyData = data?.data || [];

  const stats = {
    totalDone:
      historyData.filter((t: any) => t.status === TaskStatus.DONE).length || 0,
    totalCancelled:
      historyData.filter((t: any) => t.status === TaskStatus.CANCELLED)
        .length || 0,
    // Giả sử mỗi task có field distance (nếu không có thì = 0)
    totalDistance:
      historyData.reduce(
        (acc: number, curr: any) => acc + (curr.distance || 0),
        0,
      ) || 0,
  };

  return {
    tasks: historyData,
    meta: {
      total: data?.total || 0,
      page: data?.page || 1,
      totalPages: data?.totalPages || 1,
    },
    stats,
    isLoading,
    refetch,
  };
};
