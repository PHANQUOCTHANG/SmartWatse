import { TaskStatus } from "../types";

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    [TaskStatus.PENDING]: "Chờ xử lý",
    [TaskStatus.IN_PROGRESS]: "Đang thực hiện",
    [TaskStatus.DONE]: "Hoàn thành",
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    [TaskStatus.PENDING]: "text-yellow-600",
    [TaskStatus.IN_PROGRESS]: "text-blue-600",
    [TaskStatus.DONE]: "text-green-600",
  };
  return colors[status] || "text-gray-600";
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    [TaskStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700",
    [TaskStatus.DONE]: "bg-green-100 text-green-600",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
};
