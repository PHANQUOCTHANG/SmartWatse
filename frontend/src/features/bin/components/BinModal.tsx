import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Trash2,
  Edit,
  Image as ImageIcon,
  Zap,
  Battery,
  Thermometer,
  MapPin,
  LayoutGrid,
  Barcode,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAppSelector } from "@/store/hooks";

// Components
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
import { BinStatus, IBin } from "@/features/bin/types";
import { useBinModalLogic } from "@/features/bin/hooks/useBinModalLogic";
import { MapCoordinatePicker } from "@/features/map-monitor/components/MapCoordinatePicker";
import { MapCollectionPointSelect } from "@/features/collection-points/components/MapCollectionPointSelect";

interface BinModalProps {
  isOpen: boolean;
  onClose: () => void;
  binToEdit?: IBin | null;
}

const BinModal: React.FC<BinModalProps> = (props) => {
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
    iotData,
  } = useBinModalLogic({ ...props, tempLocation });

  const [currentLevel, battery, temperature] = iotData || [0, 100, 30];

  if (!props.isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={props.onClose}
      />

      <div className="relative z-[101] w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                isEditing
                  ? "bg-amber-100 text-amber-600"
                  : "bg-blue-100 text-blue-600",
              )}
            >
              {isEditing ? <Edit size={20} /> : <Trash2 size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Cập nhật Thùng rác" : "Thêm Thùng rác Mới"}
              </h3>
              <p className="text-xs text-gray-500">
                Quản lý thông tin và vị trí trên bản đồ số
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={props.onClose}>
            <X size={20} className="text-gray-400" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="bin-form" onSubmit={onSubmit} className="space-y-8">
            {/* SECTION 1: VỊ TRÍ (MapCoordinatePicker) */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4">
              <Label className="text-sm font-bold uppercase text-blue-700 tracking-wider flex items-center gap-2">
                <MapPin size={16} /> Vị trí địa lý
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    Tọa độ GPS <span className="text-red-500">*</span>
                  </Label>
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
                              setValue("latitude", val.lat, {
                                shouldValidate: true,
                              });
                              setValue("longitude", val.lng, {
                                shouldValidate: true,
                              });
                              if (val.address)
                                setValue("address", val.address, {
                                  shouldDirty: true,
                                });
                            }}
                            error={errors.latitude?.message}
                            placeholder="Chọn vị trí đặt thùng..."
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    Địa chỉ chi tiết
                  </Label>
                  <Input {...register("address")} className="bg-white h-10" />
                </div>
              </div>
            </div>

            {/* SECTION 2: THÔNG TIN CHUNG */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Upload */}
              <div className="w-full md:w-1/3 space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-600">
                  Hình ảnh
                </Label>
                <div className="relative w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 overflow-hidden group cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <ImageIcon className="size-8 mb-2" />
                      <span className="text-xs font-medium">Tải ảnh lên</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Inputs */}
              <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                {/* 🔥 Điểm tập kết (MapCollectionPointSelect) */}
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1.5">
                    <LayoutGrid size={14} /> Thuộc Điểm Tập Kết{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="collectionPointId"
                    render={({ field, fieldState }) => (
                      <MapCollectionPointSelect
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        placeholder="Chọn điểm tập kết trên bản đồ..."
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Barcode size={12} /> Mã Thùng
                  </Label>
                  <Input
                    {...register("code")}
                    disabled={isEditing}
                    className="bg-gray-100 font-mono text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Dung tích (L)</Label>
                  <Input
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Loại rác</Label>
                  <Controller
                    control={control}
                    name="binType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="ORGANIC">🍏 Hữu cơ</SelectItem>
                          <SelectItem value="RECYCLE">♻️ Tái chế</SelectItem>
                          <SelectItem value="INORGANIC">🧱 Vô cơ</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Trạng thái</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        // Thêm defaultValue để tránh lỗi Uncontrolled/Controlled component

                        value={field.value}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>

                        {/* 🔥 HARDCODE TỪNG ITEM ĐỂ KHỚP DATA & HIỂN THỊ TIẾNG VIỆT */}
                        <SelectContent className="z-[200]">
                          <SelectItem value={BinStatus.ACTIVE}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>Hoạt động</span>
                            </div>
                          </SelectItem>

                          <SelectItem value={BinStatus.FULL}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-500" />
                              <span>Đầy rác</span>
                            </div>
                          </SelectItem>

                          <SelectItem value={BinStatus.OVERFLOW}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                              <span>Quá tải</span>
                            </div>
                          </SelectItem>

                          <SelectItem value={BinStatus.MAINTENANCE}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span>Bảo trì</span>
                            </div>
                          </SelectItem>

                          <SelectItem value={BinStatus.BROKEN}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gray-500" />
                              <span>Hỏng hóc</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: IOT SIMULATION */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <Label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-2">
                <Zap className="size-4 text-yellow-500" /> Cảm biến IoT
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Mức đầy</span>
                    <b className={cn(currentLevel > 80 ? "text-red-500" : "")}>
                      {currentLevel}%
                    </b>
                  </div>
                  <Controller
                    control={control}
                    name="currentLevel"
                    render={({ field }) => (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg accent-green-600 cursor-pointer"
                      />
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="flex gap-1 items-center">
                      <Battery size={12} /> Pin
                    </span>
                    <b>{battery}%</b>
                  </div>
                  <Controller
                    control={control}
                    name="battery"
                    render={({ field }) => (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
                      />
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="flex gap-1 items-center">
                      <Thermometer size={12} /> Nhiệt độ
                    </span>
                    <b>{temperature}°C</b>
                  </div>
                  <Controller
                    control={control}
                    name="temperature"
                    render={({ field }) => (
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg accent-red-500 cursor-pointer"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Ghi chú</Label>
              <Textarea
                {...register("notes")}
                placeholder="..."
                className="min-h-[80px] bg-white text-sm"
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button
            variant="outline"
            onClick={props.onClose}
            className="bg-white"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="bin-form"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 font-bold min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}{" "}
            {isEditing ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BinModal;
