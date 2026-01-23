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
import { IVehicle, VehicleStatus, VehicleType } from "../types";
import { vehicleKeys } from "@/features/vehicles/utils/areaKeys";
import { vehicleApi } from "@/features/vehicles/api/vehicleApi.ts";

interface UseVehicleModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: IVehicle | null;
}

const DEFAULT_LAT = 10.762622;
const DEFAULT_LNG = 106.660172;

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
      areaId: "",
      type: VehicleType.COMPACTOR,
      capacity: 0,
      status: VehicleStatus.AVAILABLE,
      fuelLevel: 100,
      currentLoad: 0,
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LNG,
    },
  });

  // --- 2. API MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: vehicleApi.create,
    onSuccess: () => {
      toast.success("Thêm phương tiện thành công!");
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo phương tiện"),
  });

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

  // --- 3. DATA MAPPING (EFFECT) ---
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      form.clearErrors();
      return;
    }

    // Lock scroll
    document.body.style.overflow = "hidden";

    if (vehicleToEdit) {
      // === CHẾ ĐỘ EDIT ===

      // 1. Trích xuất Area ID (Xử lý populate object nếu có)
      const areaIdVal =
        vehicleToEdit.areaId && typeof vehicleToEdit.areaId === "object"
          ? (vehicleToEdit.areaId as any)._id
          : vehicleToEdit.areaId;

      // 2. Trích xuất Tọa độ từ Interface IVehicle chuẩn
      // Backend trả về: coordinates: { lat: number, lng: number, ... }
      let lat = DEFAULT_LAT;
      let lng = DEFAULT_LNG;

      if (vehicleToEdit.coordinates) {
        lat = vehicleToEdit.coordinates.lat;
        lng = vehicleToEdit.coordinates.lng;
      }
      // Fallback an toàn cho trường hợp Backend lỡ trả về GeoJSON gốc (array)
      else if ((vehicleToEdit as any).location?.coordinates) {
        const coords = (vehicleToEdit as any).location.coordinates;
        lng = coords[0];
        lat = coords[1];
      }

      form.reset({
        plateNumber: vehicleToEdit.plateNumber,
        areaId: areaIdVal as string,
        type: vehicleToEdit.type,
        capacity: vehicleToEdit.capacity,
        status: vehicleToEdit.status,
        fuelLevel: vehicleToEdit.fuelLevel ?? 100,
        currentLoad: vehicleToEdit.currentLoad ?? 0,
        latitude: lat,
        longitude: lng,
      });
    } else {
      // === CHẾ ĐỘ CREATE ===
      form.reset({
        plateNumber: "",
        areaId: "",
        type: VehicleType.COMPACTOR,
        capacity: 0,
        status: VehicleStatus.AVAILABLE,
        fuelLevel: 100,
        currentLoad: 0,
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
      });
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, vehicleToEdit, form]);

  // --- 4. SUBMIT HANDLER ---
  const onSubmit = (data: VehicleFormValues) => {
    // Construct Payload sạch sẽ, đúng type DTO Backend yêu cầu
    const payload = {
      plateNumber: data.plateNumber,
      areaId: data.areaId,
      type: data.type,
      status: data.status,
      // Ép kiểu số
      capacity: Number(data.capacity),
      fuelLevel: Number(data.fuelLevel),
      currentLoad: Number(data.currentLoad),
      // Backend DTO yêu cầu latitude/longitude phẳng
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };

    console.log("🚀 Vehicle Payload:", payload);

    if (isEditing && vehicleToEdit) {
      updateMutation.mutate({ id: vehicleToEdit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
