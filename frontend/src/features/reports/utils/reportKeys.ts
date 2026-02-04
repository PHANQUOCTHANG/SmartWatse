import { ReportFilterParams } from "@/features/reports/types";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (filter: ReportFilterParams) =>
    [...reportKeys.lists(), { filter }] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  search: (query: string) => [...reportKeys.all, "search", query] as const,
  summary: () => [...reportKeys.all, "summary"] as const,
};
