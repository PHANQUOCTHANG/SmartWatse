import { FeedbackFilterParams } from "@/features/feedback/types/index";

export const feedbackKeys = {
  all: ["feedbacks"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (filter: FeedbackFilterParams) =>
    [...feedbackKeys.lists(), { filter }] as const,
  details: () => [...feedbackKeys.all, "detail"] as const,
  detail: (id: string) => [...feedbackKeys.details(), id] as const,
  search: (query: string) => [...feedbackKeys.all, "search", query] as const,
  stats: () => [...feedbackKeys.all, "stats"] as const,
};
