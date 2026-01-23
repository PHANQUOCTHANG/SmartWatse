import { CollectionPointFilterParams } from "../types";

export const collectionPointKeys = {
  all: ["collection-points"] as const,
  lists: () => [...collectionPointKeys.all, "list"] as const,
  list: (filter: CollectionPointFilterParams) =>
    [...collectionPointKeys.lists(), { filter }] as const,
  details: () => [...collectionPointKeys.all, "detail"] as const,
  detail: (id: string) => [...collectionPointKeys.details(), id] as const,
};
