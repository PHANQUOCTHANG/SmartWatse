import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

// API & Utilities
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";

// Types & Schemas
import { VehicleFormValues, vehicleSchema } from "../schemas/vehicle.schema";
import { IVehicle, VehicleStatus } from "../types";
import { vehicleApi } from "@/features/vehicles/api/vehicleApi.ts";
import { vehicleKeys } from "@/features/vehicles/utils/areaKeys";

interface UseVehicleModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: IVehicle | null;
}

export const useVehicleModalLogic = ({
  isOpen,
  onClose,
  vehicleToEdit,
}: UseVehicleModalLogicProps) => {
  const isEditing = !!vehicleToEdit;

  // --- 1. FORM SETUP ---
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      type: undefined, // Để user buộc phải chọn
      capacity: 0,
      status: VehicleStatus.AVAILABLE,
      fuelLevel: 100,
      currentLoad: 0,
    },
  });

  // --- 2. API MUTATIONS ---

  // Mutation: Tạo mới
  const createMutation = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => {
      toast.success("Thêm phương tiện thành công!");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo phương tiện"),
  });

  // Mutation: Cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: VehicleFormValues }) =>
      vehicleApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin xe thành công!");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // --- 3. EFFECT: RESET DATA ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      // UX: Khóa scroll body khi mở modal
      document.body.style.overflow = "hidden";

      if (vehicleToEdit) {
        // --- MODE: EDIT (Fill Data) ---
        form.reset({
          plateNumber: vehicleToEdit.plateNumber,
          type: vehicleToEdit.type,
          capacity: vehicleToEdit.capacity,
          status: vehicleToEdit.status,
          fuelLevel: vehicleToEdit.fuelLevel ?? 100,
          currentLoad: vehicleToEdit.currentLoad ?? 0,
        });
      } else {
        // --- MODE: CREATE (Reset Default) ---
        form.reset({
          plateNumber: "",
          type: undefined,
          capacity: 0,
          status: VehicleStatus.AVAILABLE,
          fuelLevel: 100,
          currentLoad: 0,
        });
      }
    } else {
      // Cleanup: Mở lại scroll khi đóng
      document.body.style.overflow = "unset";
      form.clearErrors(); // Xóa lỗi cũ nếu có
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, vehicleToEdit, form]);

  // --- 4. SUBMIT HANDLER ---
  const onSubmit = (data: VehicleFormValues) => {
    if (isEditing && vehicleToEdit) {
      // Gọi API Update
      updateMutation.mutate({ id: vehicleToEdit.id, data });
    } else {
      // Gọi API Create
      createMutation.mutate(data);
    }
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
