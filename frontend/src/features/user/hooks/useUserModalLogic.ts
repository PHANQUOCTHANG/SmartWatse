import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import { queryClient } from "@/lib/queryClient";
import { userKeys } from "../utils/userKeys";
import {
  createUserSchema, // Dùng schema này làm base cho form
  CreateUserFormValues,
} from "../schemas/user.schema";
import { IUser, UserRole } from "../types";
import { handleError } from "@/utils/handleError";

interface UseUserModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: IUser | null;
}

// Mở rộng type form để bao gồm field isActive (thường chỉ dùng khi edit)
type UserFormValues = CreateUserFormValues & {
  isActive?: boolean;
  password?: string; // Override để password optional khi edit
};

export const useUserModalLogic = ({
  isOpen,
  onClose,
  userToEdit,
}: UseUserModalLogicProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!userToEdit;

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (data: any) => userApi.create(data),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo người dùng"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // --- FORM SETUP ---
  const form = useForm<UserFormValues>({
    // Khi Edit, ta có thể dùng schema lỏng hơn (password optional)
    // Nhưng ở đây tạm dùng chung schema create, cần xử lý password logic ở dưới
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "CITIZEN",
      phoneNumber: "",
      address: "",
      password: "", // Mật khẩu mặc định rỗng
      isActive: true,
      avatar: null,
    },
  });

  // --- RESET & MAP DATA ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (userToEdit) {
        // --- MODE: EDIT ---
        form.reset({
          fullName: userToEdit.fullName,
          email: userToEdit.email,
          role: userToEdit.role as UserRole,
          phoneNumber: userToEdit.phoneNumber || "",
          address: userToEdit.address || "",
          password: "", // Không điền mật khẩu cũ
          isActive: userToEdit.isActive,
          // Image: Giữ URL ảnh cũ nếu có
          avatar: userToEdit.avatar || null,
        });
        setImagePreview(userToEdit.avatar || null);
      } else {
        // --- MODE: CREATE ---
        form.reset({
          fullName: "",
          email: "",
          role: "CITIZEN",
          phoneNumber: "",
          address: "",
          password: "",
          isActive: true,
          avatar: null,
        });
        setImagePreview(null);
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, userToEdit, form]);

  // --- HANDLERS ---

  // Xử lý upload ảnh (Preview ngay lập tức)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate size < 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn (Max 5MB)");
        return;
      }
      form.setValue("avatar", file, { shouldDirty: true });
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      // Cleanup memory
      return () => URL.revokeObjectURL(url);
    }
  };

  // Submit Form
  const onSubmit = (data: UserFormValues) => {
    // Logic riêng cho password khi Edit:
    // Nếu đang Edit và password rỗng -> Xóa field password khỏi payload để BE không hash chuỗi rỗng
    const payload = { ...data };

    if (isEditing && !payload.password) {
      delete payload.password;
    }

    if (isEditing && userToEdit) {
      updateMutation.mutate({ id: userToEdit._id, data: payload });
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
