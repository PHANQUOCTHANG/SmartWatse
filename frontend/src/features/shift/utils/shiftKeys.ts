export const shiftKeys = {
  all: ["shifts"] as const,
  lists: () => [...shiftKeys.all, "list"] as const,
  list: (params: any) => [...shiftKeys.lists(), { params }] as const,
  current: () => [...shiftKeys.all, "current"] as const,
  detail: (id: string) => [...shiftKeys.all, "detail", id] as const,
};
