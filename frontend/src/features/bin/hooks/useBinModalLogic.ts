// src/features/bin/hooks/useBinModalLogic.ts

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { handleError } from "@/utils/handleError";
import { BinFormValues, binSchema } from "@/features/bin/schemas/bin.schema";
import { binApi, BinStatus, BinType, IBin } from "@/features/bin";
import { binKeys } from "@/features/bin/utils/binKeys";

interface UseBinModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  binToEdit?: IBin | null;
  tempLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_LAT = 10.762622;
const DEFAULT_LNG = 106.660172;

export const useBinModalLogic = ({
  isOpen,
  onClose,
  binToEdit,
  tempLocation,
}: UseBinModalLogicProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditing = !!binToEdit;

  // --- 1. FORM SETUP ---
  const form = useForm<BinFormValues>({
    resolver: zodResolver(binSchema),
    defaultValues: {
      code: "",
      collectionPointId: "",
      binType: BinType.ORGANIC,
      capacity: 240,
      latitude: DEFAULT_LAT,
      longitude: DEFAULT_LNG,
      address: "",
      currentLevel: 0,
      status: BinStatus.ACTIVE,
      brand: "",
      notes: "",
      battery: 100,
      temperature: 30,
    },
  });

  // --- 2. REALTIME WATCH ---
  const iotData = useWatch({
    control: form.control,
    name: ["currentLevel", "battery", "temperature"],
  });

  // --- 3. MUTATIONS ---
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

  // --- 4. DATA MAPPING & RESET ---
  useEffect(() => {
    if (!isOpen) {
      form.clearErrors();
      return;
    }

    if (binToEdit) {
      // === CHẾ ĐỘ EDIT ===
      // Backend service đã trả về flat latitude/longitude, dùng luôn
      const lng = binToEdit.longitude ?? DEFAULT_LNG;
      const lat = binToEdit.latitude ?? DEFAULT_LAT;
      console.log(binToEdit, BinStatus);
      // Xử lý CollectionPointId (phòng trường hợp populate object)
      const cpId =
        binToEdit.collectionPointId &&
        typeof binToEdit.collectionPointId === "object" &&
        "_id" in binToEdit.collectionPointId
          ? (binToEdit.collectionPointId as any)._id
          : binToEdit.collectionPointId;
      const safeStatus = binToEdit.status
        ? (binToEdit.status.toString().toUpperCase() as BinStatus)
        : BinStatus.ACTIVE;

      // 3. Xử lý BinType an toàn
      const safeType = binToEdit.binType
        ? (binToEdit.binType.toString().toUpperCase() as BinType)
        : BinType.ORGANIC;
      form.reset({
        code: binToEdit.code,
        collectionPointId: cpId as string,
        binType: safeType,
        capacity: binToEdit.capacity,
        brand: binToEdit.brand,
        latitude: lat,
        longitude: lng,
        address: binToEdit.address,
        currentLevel: binToEdit.currentLevel ?? 0,
        status: safeStatus, // ✅ FIX
        battery: binToEdit.battery ?? 100,
        temperature: binToEdit.temperature ?? 30,
        notes: binToEdit.notes,
      });

      // Set ảnh preview từ URL cũ
      setImagePreview(binToEdit.coverImage || null);
    } else {
      // === CHẾ ĐỘ CREATE ===
      form.reset({
        code: `BIN-${Date.now().toString().slice(-6)}`,
        collectionPointId: "",
        binType: BinType.ORGANIC,
        capacity: 240,
        latitude: tempLocation?.lat || DEFAULT_LAT,
        longitude: tempLocation?.lng || DEFAULT_LNG,
        address: "",
        currentLevel: 0,
        status: BinStatus.ACTIVE,
        battery: 100,
        temperature: 30,
        brand: "",
        notes: "",
      });
      setImagePreview(null);
    }
  }, [isOpen, binToEdit, tempLocation, form]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File max 5MB");
      form.setValue("coverImage", file, { shouldDirty: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: BinFormValues) => {
    const payload: any = { ...data };

    // 🔥 FIX 1: Xóa triệt để field 'location' (nguyên nhân gây lỗi 422)
    // Field này tồn tại do form.reset(binToEdit) nạp vào nhưng DTO backend không cho phép
    delete payload.location;

    // 🔥 FIX 2: Xóa các field rác khác nếu lỡ dính vào từ binToEdit

    // 🔥 FIX 3: Xử lý coverImage rỗng "{}"
    // Nếu coverImage không phải là File (VD: là object rỗng {} do react-hook-form, hoặc url string), xóa đi
    if (!(payload.coverImage instanceof File)) {
      delete payload.coverImage;
    }

    // 2. Ép kiểu số cho các trường cần thiết
    payload.capacity = Number(data.capacity);
    payload.currentLevel = Number(data.currentLevel);
    payload.battery = Number(data.battery);
    payload.temperature = Number(data.temperature);
    payload.latitude = Number(data.latitude);
    payload.longitude = Number(data.longitude);

    console.log("🚀 Payload sạch sẽ gửi đi:", payload);

    // 3. Gửi đi
    if (isEditing && binToEdit) {
      delete payload.code;
      updateMutation.mutate({ id: binToEdit.id, data: payload });
    } else {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
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
    iotData,
  };
};
