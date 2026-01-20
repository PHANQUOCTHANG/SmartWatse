import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
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

  // --- MUTATIONS ---
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

  // --- FORM SETUP ---
  const form = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: "",
      type: AreaType.DISTRICT, // Mặc định là Quận
      parentId: null,
    },
  });

  // --- RESET & MAP DATA ---
  useEffect(() => {
    if (isOpen) {
      // Prevent scroll background
      document.body.style.overflow = "hidden";

      if (areaToEdit) {
        // --- MODE: EDIT ---

        // Xử lý parentId: Backend có thể trả về null, string ID, hoặc Object {id, name}
        let mappedParentId = null;
        if (areaToEdit.parentId) {
          if (
            typeof areaToEdit.parentId === "object" &&
            "id" in areaToEdit.parentId
          ) {
            // Nếu là object (đã populate) -> lấy id
            mappedParentId = areaToEdit.parentId.id;
          } else {
            // Nếu là string
            mappedParentId = areaToEdit.parentId as string;
          }
        }

        form.reset({
          name: areaToEdit.name,
          type: areaToEdit.type,
          parentId: mappedParentId,
        });
      } else {
        // --- MODE: CREATE ---
        form.reset({
          name: "",
          type: AreaType.DISTRICT,
          parentId: null,
        });
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, areaToEdit, form]);

  // --- SUBMIT HANDLER ---
  const onSubmit = (data: AreaFormValues) => {
    // Logic clean data trước khi gửi
    const payload = { ...data };

    // Nếu type là DISTRICT -> bắt buộc parentId phải là null (dù form có gửi rác)
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
    onSubmit: form.handleSubmit(onSubmit),
  };
};
