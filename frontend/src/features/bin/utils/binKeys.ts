import { BinFilterParams } from "@/features/bin/types";

// features/track/utils/binKeys.ts
export const binKeys = {
  all: ["bins"] as const,
  lists: () => [...binKeys.all, "list"] as const,
  list: (filter: BinFilterParams) => [...binKeys.lists(), { filter }] as const,
  details: () => [...binKeys.all, "detail"] as const,
  detail: (slug: string) => [...binKeys.details(), slug] as const,
  search: (query: string) => [...binKeys.all, "search", query] as const,
};
