import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { scheduleApi } from "../api/scheduleApi";
import { queryClient } from "@/lib/queryClient";
import { scheduleKeys } from "../utils/scheduleKeys";
import { scheduleSchema, ScheduleFormValues } from "../schemas/schedule.schema";
import { ISchedule } from "../types";
import { handleError } from "@/utils/handleError";

interface UseScheduleModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleToEdit?: ISchedule | null;
}

export const useScheduleModalLogic = ({
  isOpen,
  onClose,
  scheduleToEdit,
}: UseScheduleModalLogicProps) => {
  const isEditing = !!scheduleToEdit;

  // Tạo lịch trình mới
  const createMutation = useMutation({
    mutationFn: (data: ScheduleFormValues) => scheduleApi.create(data),
    onSuccess: () => {
      toast.success("Thêm lịch trình mới thành công!");
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo mới"),
  });

  // Cập nhật lịch trình
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleFormValues }) =>
      scheduleApi.update(id, data),
    onSuccess: () => {  
      toast.success("Cập nhật lịch trình thành công!");
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Khởi tạo form
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      district: "",
      date: "",
      startTime: "08:00",
      endTime: "17:00",
      frequency: "hàng_ngày",
      status: "PENDING",
    },
  });

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (scheduleToEdit) {
        // Mode: EDIT -> Map data
        form.reset({
          name: scheduleToEdit.name,
          district: scheduleToEdit.district,
          date: scheduleToEdit.date,
          startTime: scheduleToEdit.startTime,
          endTime: scheduleToEdit.endTime,
          frequency: scheduleToEdit.frequency,
          status: (scheduleToEdit.status as any) || "PENDING",
        });
      } else {
        // Mode: CREATE -> Clear form
        form.reset({
          name: "",
          district: "",
          date: "",
          startTime: "08:00",
          endTime: "17:00",
          frequency: "hàng_ngày",
          status: "PENDING",
        });
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, scheduleToEdit, form]);

  // Xử lý submit form
  const onSubmit = async (data: ScheduleFormValues) => {
    if (isEditing && scheduleToEdit) {
      await updateMutation.mutateAsync({
        id: scheduleToEdit._id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return {
    form,
    isPending,
    isEditing,
    onSubmit,
    onClose,
  };
};
