import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { collectionPointApi } from "../api/collectionPointApi";
import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import {
  collectionPointSchema,
  CollectionPointFormValues,
} from "../schemas/collectionPoint.schema";
import { ICollectionPoint, CollectionPointStatus } from "../types";
import { collectionPointKeys } from "@/features/collection-points/utils/areaKeys";

interface UseCollectionPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ICollectionPoint | null;
  tempLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_LAT = 10.762622;
const DEFAULT_LNG = 106.660172;

export const useCollectionPointModal = ({
  isOpen,
  onClose,
  itemToEdit,
  tempLocation,
}: UseCollectionPointModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!itemToEdit;

  // --- 1. FORM SETUP ---
  const form = useForm<CollectionPointFormValues>({
    resolver: zodResolver(collectionPointSchema),
    defaultValues: {
      name: "",
      code: "",
      areaId: "",
      address: "",
      capacity: 100,
      status: CollectionPointStatus.ACTIVE,
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LNG,
    },
  });

  // --- 2. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: collectionPointApi.create,
    onSuccess: () => {
      toast.success("Thêm điểm tập kết thành công!");
      queryClient.invalidateQueries({ queryKey: collectionPointKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo mới"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      collectionPointApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: collectionPointKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // --- 3. DATA MAPPING & RESET ---
  useEffect(() => {
    if (!isOpen) {
      form.clearErrors();
      setImagePreview(null);
      return;
    }

    if (itemToEdit) {
      // === CHẾ ĐỘ EDIT ===
      const lat = itemToEdit.latitude ?? DEFAULT_LAT;
      const lng = itemToEdit.longitude ?? DEFAULT_LNG;

      // Xử lý AreaId (phòng trường hợp populate object)
      const areaIdVal =
        itemToEdit.areaId && typeof itemToEdit.areaId === "object"
          ? (itemToEdit.areaId as any)._id
          : itemToEdit.areaId;

      form.reset({
        name: itemToEdit.name,
        code: itemToEdit.code,
        areaId: areaIdVal,
        address: itemToEdit.address,
        capacity: itemToEdit.capacity,
        status: itemToEdit.status,
        latitude: lat,
        longitude: lng,
      });
      setImagePreview(itemToEdit.image || null);
    } else {
      // === CHẾ ĐỘ CREATE ===
      form.reset({
        name: "",
        code: `CP-${Date.now().toString().slice(-4)}`, // Auto generate code
        areaId: "",
        address: "",
        capacity: 100,
        status: CollectionPointStatus.ACTIVE,
        // 🔥 Ưu tiên lấy tọa độ từ hành động click trên map (Redux)
        latitude: tempLocation?.lat || DEFAULT_LAT,
        longitude: tempLocation?.lng || DEFAULT_LNG,
      });
      setImagePreview(null);
    }
  }, [isOpen, itemToEdit, tempLocation, form]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File max 5MB");
      form.setValue("image", file, { shouldDirty: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: CollectionPointFormValues) => {
    // 🔥 COPY PAYLOAD ĐỂ TRÁNH SỬA TRỰC TIẾP FORM DATA GỐC
    const payload: any = { ...data };

    // 🔥 FIX 1: Xử lý field image rỗng "{}" hoặc string URL cũ
    // Nếu image không phải là File (VD: là object rỗng {} do react-hook-form, hoặc url string), xóa đi
    // để tránh gửi string "url..." lên backend gây lỗi upload file
    if (!(payload.image instanceof File)) {
      delete payload.image;
    }

    // 🔥 FIX 2: Ép kiểu số cho các trường quan trọng (đề phòng form trả về string)
    payload.capacity = Number(data.capacity);
    payload.latitude = Number(data.latitude);
    payload.longitude = Number(data.longitude);

    console.log("🚀 Payload sạch sẽ gửi đi:", payload);

    // 3. Gửi đi (API layer sẽ tự động buildFormData từ object này)
    if (isEditing && itemToEdit) {
      delete payload.code;
      updateMutation.mutate({ id: itemToEdit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    form,
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
