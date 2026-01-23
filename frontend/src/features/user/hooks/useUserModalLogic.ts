// src/features/user/hooks/useUserModalLogic.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { userApi } from "../api/userApi";
import { queryClient } from "@/lib/queryClient";
import { userKeys } from "../utils/userKeys";
import {
  createUserSchema,
  updateUserSchema,
  UserFormValues,
} from "../schemas/user.schema";
import { IUser, UserRole } from "../types";
import { handleError } from "@/utils/handleError";

/* ---------------- HELPERS ---------------- */

const getStatusFromBool = (isActive?: boolean) =>
  isActive ? "ACTIVE" : "INACTIVE";

const getBoolFromStatus = (status?: string) => status === "ACTIVE";

/* ---------------- TYPES ---------------- */

interface UseUserModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: IUser | null;
}

/* ---------------- HOOK ---------------- */

export const useUserModalLogic = ({
  isOpen,
  onClose,
  userToEdit,
}: UseUserModalLogicProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!userToEdit;

  /* 🔥 SCHEMA ĐỘNG */
  const schema = isEditing ? updateUserSchema : createUserSchema;

  /* 🔥 FORM */
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: true, // ⭐ FIX QUAN TRỌNG
    defaultValues: {
      fullName: "",
      email: "",
      role: UserRole.CITIZEN,
      phoneNumber: "",
      address: "",
      password: "",
      isActive: true,
      avatar: null,
      areaId: "",
    },
  });

  /* ---------------- RESET & MAP DATA ---------------- */

  useEffect(() => {
    if (!isOpen) {
      // 🔥 CLEAR CỨNG KHI ĐÓNG MODAL
      form.reset({
        fullName: "",
        email: "",
        role: UserRole.CITIZEN,
        phoneNumber: "",
        address: "",
        password: "",
        isActive: true,
        avatar: null,
        areaId: "",
      });
      form.clearErrors();
      setImagePreview(null);
      return;
    }

    if (userToEdit) {
      // ===== EDIT MODE =====

      const safeRole = userToEdit.role
        ? (userToEdit.role.toUpperCase() as UserRole)
        : UserRole.CITIZEN;

      const safeAreaId =
        userToEdit.areaId && typeof userToEdit.areaId === "object"
          ? (userToEdit.areaId as any)._id
          : userToEdit.areaId || "";

      form.reset({
        fullName: userToEdit.fullName,
        email: userToEdit.email,
        role: safeRole,
        phoneNumber: userToEdit.phoneNumber || "",
        address: userToEdit.address || "",
        password: "",
        isActive: getBoolFromStatus(userToEdit.status),
        avatar: null,
        areaId: safeAreaId,
      });

      setImagePreview(
        typeof userToEdit.avatar === "string" ? userToEdit.avatar : null,
      );
    }
  }, [isOpen, userToEdit, form]);

  /* ---------------- ROLE WATCHER ---------------- */

  const watchedRole = form.watch("role");

  useEffect(() => {
    // 🔥 ROLE ≠ STAFF / MANAGER → CẮT LUÔN areaId
    if (watchedRole !== UserRole.STAFF && watchedRole !== UserRole.MANAGER) {
      form.unregister("areaId");
    }
  }, [watchedRole, form]);

  /* ---------------- MUTATIONS ---------------- */

  const createMutation = useMutation({
    mutationFn: userApi.create,
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
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ---------------- HANDLERS ---------------- */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn (Max 5MB)");
      return;
    }

    form.setValue("avatar", file, { shouldDirty: true });
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const onSubmit = (data: UserFormValues) => {
    const payload: any = {
      ...data,
      status: getStatusFromBool(data.isActive),
    };

    delete payload.isActive;

    if (isEditing && !payload.password) delete payload.password;
    if (!(payload.avatar instanceof File)) delete payload.avatar;

    if (payload.role !== UserRole.MANAGER && payload.role !== UserRole.STAFF) {
      delete payload.areaId;
    }

    if (isEditing && userToEdit) {
      updateMutation.mutate({ id: userToEdit.id, data: payload });
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
