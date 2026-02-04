import { useQuery, useMutation } from "@tanstack/react-query";
import { taskAssignmentApi } from "../api/taskApi";
import { taskKeys } from "../utils/taskKeys";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { TaskStatus } from "../types";
import { handleError } from "@/utils/handleError";

// Hook lấy chi tiết Task
export const useTaskDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: taskKeys.detail(id || ""),
    queryFn: () => taskAssignmentApi.getById(id!),
    enabled: !!id, // Chỉ fetch khi có ID
    staleTime: 1000 * 60, // Cache 1 phút
  });
};

// Hook cập nhật trạng thái Task (Dành riêng cho Staff)
export const useUpdateTaskStatus = (taskId: string) => {
  return useMutation({
    mutationFn: (newStatus: TaskStatus) =>
      taskAssignmentApi.update(taskId, {
        note: undefined,
        status: newStatus,
      } as any), // Chỉ update status
    // Lưu ý: DTO của bạn có thể cần mở rộng để cho phép update status riêng lẻ
    // Nếu API update nhận Partial<CreateTaskDTO> thì bạn cần đảm bảo DTO cho phép status.
    // Nếu không, bạn có thể cần tạo thêm API endpoint riêng: PATCH /tasks/:id/status

    onMutate: async (newStatus) => {
      // Optimistic Update: Cập nhật giao diện ngay lập tức trước khi API trả về
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(taskId) });

      const previousTask = queryClient.getQueryData(taskKeys.detail(taskId));

      queryClient.setQueryData(taskKeys.detail(taskId), (old: any) => ({
        ...old,
        status: newStatus,
      }));

      return { previousTask };
    },

    onSuccess: (data, newStatus) => {
      // Dựa vào status mới để hiện thông báo phù hợp
      const statusMessages = {
        [TaskStatus.IN_PROGRESS]: "Đã bắt đầu nhiệm vụ!",
        [TaskStatus.DONE]: "Chúc mừng! Bạn đã hoàn thành nhiệm vụ.",
        [TaskStatus.CANCELLED]: "Đã hủy nhiệm vụ.",
        [TaskStatus.PENDING]: "Đã chuyển về trạng thái chờ.",
      };

      toast.success(statusMessages[newStatus] || "Cập nhật thành công");

      // Invalidate list để danh sách bên ngoài cũng cập nhật
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },

    onError: (err, _, context) => {
      // Rollback nếu lỗi
      queryClient.setQueryData(taskKeys.detail(taskId), context?.previousTask);
      handleError(err, "Không thể cập nhật trạng thái");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
};
