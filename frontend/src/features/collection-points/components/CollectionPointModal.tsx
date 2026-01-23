import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Edit,
  Plus,
  MapPin,
  LayoutGrid,
  Type,
  Hash,
  Weight,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Redux
import { useAppSelector } from "@/store/hooks";

// Hooks & Logic
import { useCollectionPointModal } from "@/features/collection-points/hooks/useCollectionPointModal";
import {
  ICollectionPoint,
  CollectionPointStatus,
} from "@/features/collection-points/types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Map Components
import { MapAreaSelect } from "@/features/area/components/MapAreaSelect";
import { MapCoordinatePicker } from "@/features/map-monitor/components/MapCoordinatePicker";

interface CollectionPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ICollectionPoint | null;
}

const CollectionPointModal: React.FC<CollectionPointModalProps> = (props) => {
  // 🔥 Lấy tempLocation từ Redux (được set khi click nút Thêm trên Map)
  const tempLocation = useAppSelector((state) => state.map.tempLocation);

  const {
    form: {
      register,
      control,
      setValue,
      formState: { errors },
    },
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit,
  } = useCollectionPointModal({ ...props, tempLocation });

  if (!props.isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={props.onClose}
      />

      <div className="relative z-[101] w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                isEditing
                  ? "bg-purple-100 text-purple-600"
                  : "bg-indigo-100 text-indigo-600",
              )}
            >
              {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Cập nhật Điểm Tập Kết" : "Thêm Điểm Tập Kết Mới"}
              </h3>
              <p className="text-xs text-gray-500">
                Quản lý trạm trung chuyển rác thải đô thị
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={props.onClose}>
            <X size={20} className="text-gray-400" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-6">
          <form
            id="collection-point-form"
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* --- CỘT TRÁI: THÔNG TIN (5/12) --- */}
            <div className="lg:col-span-5 space-y-5">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Hình ảnh trạm
                </Label>
                <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-indigo-400 transition-colors cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
                      <ImageIcon className="size-8 mb-2" />
                      <span className="text-xs font-medium">Tải ảnh lên</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Tên & Mã */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold flex gap-1.5">
                    <Type size={14} /> Tên trạm{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("name")}
                    placeholder="VD: Trạm trung chuyển Chợ Lớn"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex gap-1.5">
                      <Hash size={14} /> Mã trạm{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("code")}
                      placeholder="CP-001"
                      className="uppercase font-mono bg-gray-50"
                    />
                    {errors.code && (
                      <p className="text-[10px] text-red-500">
                        {errors.code.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold flex gap-1.5">
                      <Weight size={14} /> Sức chứa (Tấn)
                    </Label>
                    <Input type="number" {...register("capacity")} />
                  </div>
                </div>
              </div>

              {/* Khu vực & Trạng thái */}
              <div className="space-y-3 pt-2 border-t border-dashed">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold flex gap-1.5">
                    <LayoutGrid size={14} /> Khu vực quản lý{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="areaId"
                    render={({ field, fieldState }) => (
                      <MapAreaSelect
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        placeholder="Chọn Quận/Phường..."
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">
                    Trạng thái hoạt động
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-200">
                          <SelectItem value={CollectionPointStatus.ACTIVE}>
                            🟢 Đang hoạt động
                          </SelectItem>
                          <SelectItem value={CollectionPointStatus.MAINTENANCE}>
                            🟠 Bảo trì
                          </SelectItem>
                          <SelectItem value={CollectionPointStatus.INACTIVE}>
                            🔴 Ngưng hoạt động
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: BẢN ĐỒ (7/12) --- */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-bold uppercase text-indigo-700 tracking-wider flex items-center gap-2">
                    <MapPin size={16} /> Vị trí địa lý
                  </Label>
                  <span className="text-[10px] text-indigo-400 bg-white px-2 py-1 rounded shadow-sm">
                    Kéo marker để chỉnh
                  </span>
                </div>

                {/* MAP PICKER */}
                <div className="flex-1 min-h-[350px] rounded-lg overflow-hidden shadow-inner border border-indigo-100 relative">
                  <Controller
                    control={control}
                    name="latitude"
                    render={({ field: latField }) => (
                      <Controller
                        control={control}
                        name="longitude"
                        render={({ field: lngField }) => (
                          <MapCoordinatePicker
                            value={
                              latField.value && lngField.value
                                ? { lat: latField.value, lng: lngField.value }
                                : undefined
                            }
                            onChange={(val) => {
                              // 1. Cập nhật tọa độ
                              setValue("latitude", val.lat, {
                                shouldValidate: true,
                              });
                              setValue("longitude", val.lng, {
                                shouldValidate: true,
                              });

                              // 🔥 2. TỰ ĐỘNG CẬP NHẬT ĐỊA CHỈ (Logic giống Bin)
                              if (val.address) {
                                setValue("address", val.address, {
                                  shouldDirty: true,
                                });
                              }
                            }}
                            error={errors.latitude?.message}
                            placeholder="Chọn vị trí điểm tập kết..."
                          />
                        )}
                      />
                    )}
                  />
                </div>

                {/* Address Auto-fill */}
                <div className="mt-4 space-y-2">
                  <Label className="text-xs text-gray-600">
                    Địa chỉ chi tiết (Tự động điền từ bản đồ)
                  </Label>
                  <Textarea
                    {...register("address")}
                    className="bg-white resize-none min-h-[60px] text-sm"
                    placeholder="Địa chỉ sẽ hiện ở đây khi bạn chọn vị trí..."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <Button
            variant="outline"
            onClick={props.onClose}
            className="bg-white"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="collection-point-form"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold min-w-[140px]"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Lưu thay đổi" : "Tạo điểm mới"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CollectionPointModal;
