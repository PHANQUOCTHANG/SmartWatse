import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import { shiftKeys } from "../utils/shiftKeys";
import type {
  StartShiftPayload,
  EndShiftPayload,
  ShiftFilterParams,
  IShift,
  PagedShifts,
} from "../types";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export const useShifts = () => {
  const [filterParams, setFilterParams] = useState<ShiftFilterParams>({
    page: 1,
    limit: 10,
  });

  const currentQuery = useQuery({
    queryKey: shiftKeys.current(),
    queryFn: () => shiftApi.getCurrent(),
    staleTime: 1000 * 30,
  });

  const listQuery = useQuery({
    queryKey: shiftKeys.list(filterParams),
    queryFn: () => shiftApi.getAll(filterParams),
    enabled: true,
    keepPreviousData: true,
  });

  const startMutation = useMutation({
    mutationFn: (payload: StartShiftPayload) => shiftApi.startShift(payload),
    onSuccess: (data: IShift) => {
      toast.success("Bắt đầu ca thành công");
      queryClient.invalidateQueries({ queryKey: shiftKeys.current() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
    },
  });

  const endMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EndShiftPayload }) =>
      shiftApi.endShift(id, payload),
    onSuccess: () => {
      toast.success("Kết thúc ca thành công");
      queryClient.invalidateQueries({ queryKey: shiftKeys.current() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
    },
  });

  return {
    // current
    current: currentQuery.data,
    isCurrentLoading: currentQuery.isLoading,

    // list
    shiftsList: (listQuery.data as PagedShifts | undefined)?.data || [],
    shiftsMeta: listQuery.data,
    isListLoading: listQuery.isLoading,
    filterParams,
    setFilterParams,

    // mutations
    startShift: (payload: StartShiftPayload, options?: any) =>
      startMutation.mutate(payload, options),
    endShift: (id: string, payload: EndShiftPayload, options?: any) =>
      endMutation.mutate({ id, payload }, options),

    // statuses
    isStarting: startMutation.isPending,
    isEnding: endMutation.isPending,
  };
};
