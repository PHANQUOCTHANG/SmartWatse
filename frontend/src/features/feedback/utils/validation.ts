import {
  FeedbackFilterInput,
  feedbackFilterSchema,
} from "../schemas/feedback.schema";

export const validateFeedbackFilters = (params: any): FeedbackFilterInput => {
  try {
    return feedbackFilterSchema.parse(params);
  } catch (error) {
    console.error("Validation error:", error);
    return feedbackFilterSchema.parse({});
  }
};

export const getStatusBadgeColor = (status: string) => {
  const statusMap: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
  };
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

export const getStatusBadgeLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    NEW: "Mới",
    PROCESSING: "Đang xử lý",
    RESOLVED: "Đã giải quyết",
  };
  return labelMap[status] || status;
};

export const formatDate = (dateString: string | Date): string => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const truncateText = (text: string, length: number = 100): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
