import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { binApi } from "../api/binApi";
import { queryClient } from "@/lib/queryClient";
import { binKeys } from "../utils/binKeys";
import { binSchema, BinFormValues } from "../schemas/bin.schema";
import { IBin } from "../types";
import { handleError } from "@/utils/handleError";

interface UseBinModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  binToEdit?: IBin | null;
}

export const useBinModalLogic = ({
  isOpen,
  onClose,
  binToEdit,
}: UseBinModalLogicProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!binToEdit;

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (data: BinFormValues) => binApi.create(data),
    onSuccess: () => {
      toast.success("Thêm thùng rác mới thành công!");
      queryClient.invalidateQueries({ queryKey: binKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi tạo mới"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BinFormValues }) =>
      binApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: binKeys.lists() });
      onClose();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // --- FORM SETUP ---
  const form = useForm<BinFormValues>({
    resolver: zodResolver(binSchema),
    defaultValues: {
      code: "",
      collectionPointId: "",
      binType: "ORGANIC",
      capacity: 120,
      latitude: 10.762,
      longitude: 106.66,
      address: "",
      currentLevel: 0,
      status: "ACTIVE",
      brand: "",
      installationDate: new Date().toISOString(),
      notes: "",
      coverImage: null,
      battery: 100,
      temperature: 25,
    },
  });

  // --- RESET & MAP DATA ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scroll background

      if (binToEdit) {
        // Mode: EDIT -> Map data
        form.reset({
          code: binToEdit.code,
          collectionPointId: binToEdit.collectionPointId,
          binType: binToEdit.binType,
          capacity: binToEdit.capacity,
          // Map Coordinates [Lng, Lat] -> Lat, Lng riêng
          latitude: binToEdit.location.coordinates[1],
          longitude: binToEdit.location.coordinates[0],
          address: binToEdit.address || "",
          currentLevel: binToEdit.currentLevel,
          status: binToEdit.status,
          brand: binToEdit.brand || "",
          installationDate:
            binToEdit.installationDate || new Date().toISOString(),
          notes: binToEdit.notes || "",
          battery: binToEdit.battery,
          temperature: binToEdit.temperature,
          // Image: Giữ nguyên URL string nếu có
          coverImage: binToEdit.coverImage || null,
        });
        setImagePreview(binToEdit.coverImage || null);
      } else {
        // Mode: CREATE -> Reset default
        form.reset({
          code: "",
          collectionPointId: "", // Cần replace bằng ID thật sau này
          binType: "ORGANIC",
          capacity: 120,
          latitude: 10.762,
          longitude: 106.66,
          address: "",
          currentLevel: 0,
          status: "ACTIVE",
          brand: "",
          installationDate: new Date().toISOString(),
          notes: "",
          battery: 100,
          temperature: 25,
          coverImage: null,
        });
        setImagePreview(null);
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, binToEdit, form]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn (Max 5MB)");
        return;
      }
      form.setValue("coverImage", file, { shouldDirty: true });
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      // Cleanup blob url cũ để tránh leak memory
      return () => URL.revokeObjectURL(url);
    }
  };

  const onSubmit = (data: BinFormValues) => {
    if (isEditing && binToEdit) {
      updateMutation.mutate({ id: binToEdit._id, data });
    } else {
      createMutation.mutate(data);
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
