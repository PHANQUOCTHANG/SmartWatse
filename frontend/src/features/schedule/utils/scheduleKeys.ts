import { ScheduleFilterParams } from "@/features/schedule/types/index";

export const scheduleKeys = {
  all: ["schedules"] as const,
  lists: () => [...scheduleKeys.all, "list"] as const,
  list: (filter: ScheduleFilterParams) =>
    [...scheduleKeys.lists(), { filter }] as const,
  details: () => [...scheduleKeys.all, "detail"] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  search: (query: string) => [...scheduleKeys.all, "search", query] as const,
};
