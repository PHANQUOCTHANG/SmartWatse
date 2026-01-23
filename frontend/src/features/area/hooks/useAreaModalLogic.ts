import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { areaApi } from "../api/areaApi";
import { queryClient } from "@/lib/queryClient";
import { areaKeys } from "../utils/areaKeys";
import { AreaFormValues, areaSchema } from "../schemas/area.schema";
import { IArea, AreaType } from "../types";
import { handleError } from "@/utils/handleError";

interface UseAreaModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  areaToEdit?: IArea | null;
}

export const useAreaModalLogic = ({
  isOpen,
  onClose,
  areaToEdit,
}: UseAreaModalLogicProps) => {
  const isEditing = !!areaToEdit;

  // --- 1. GET EXISTING AREAS (Để hiển thị tham chiếu trên bản đồ) ---
  const { data: areasData } = useQuery({
    queryKey: areaKeys.lists(),
    queryFn: () => areaApi.getAll({ limit: 1000 }), // Lấy hết để vẽ map
    enabled: isOpen, // Chỉ fetch khi mở modal
    staleTime: 5 * 60 * 1000,
  });

  // Lọc bỏ chính khu vực đang sửa (để tránh vẽ đè lên bóng ma của chính nó)
  const existingAreas = (areasData?.data || []).filter(
    (a) => a.id !== areaToEdit?.id,
  );

  // --- 2. FORM SETUP ---
  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: "",
      type: AreaType.DISTRICT,
      parentId: null,
      boundary: undefined, // 🔥 Init boundary
    },
  });

  // --- 3. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: areaApi.create,
    onSuccess: () => {
      toast.success("Tạo khu vực thành công!");
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo mới"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AreaFormValues }) =>
      areaApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // --- 4. RESET & MAP DATA ---
  useEffect(() => {
    if (isOpen) {
      if (areaToEdit) {
        // Edit Mode
        let mappedParentId = null;
        if (areaToEdit.parentId) {
          mappedParentId =
            typeof areaToEdit.parentId === "object" &&
            "id" in areaToEdit.parentId
              ? areaToEdit.parentId.id
              : (areaToEdit.parentId as string);
        }

        form.reset({
          name: areaToEdit.name,
          type: areaToEdit.type,
          parentId: mappedParentId,
          boundary: areaToEdit.boundary || [],
        });
      } else {
        // Create Mode
        form.reset({
          name: "",
          type: AreaType.DISTRICT,
          parentId: null,
          boundary: [],
        });
      }
    }
  }, [isOpen, areaToEdit, form]);

  const onSubmit = (data: AreaFormValues) => {
    const payload = { ...data };
    if (payload.type === AreaType.DISTRICT) {
      payload.parentId = null;
    }

    if (isEditing && areaToEdit) {
      updateMutation.mutate({ id: areaToEdit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    form,
    isEditing,
    isPending,
    existingAreas, // 🔥 Trả về list area để component vẽ
    onSubmit: form.handleSubmit(onSubmit),
  };
};
