import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Upload,
  Loader2,
  Trash2,
  Edit,
  MapPin,
  Image as ImageIcon,
  Battery,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBinModalLogic } from "../hooks/useBinModalLogic";
import { IBin, BinType, BinStatus } from "../types";

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

interface BinModalProps {
  isOpen: boolean;
  onClose: () => void;
  binToEdit?: IBin | null;
}

const BinModal: React.FC<BinModalProps> = (props) => {
  const { isOpen, onClose, binToEdit } = props;

  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit,
  } = useBinModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
              {isEditing ? (
                <Edit className="size-5" />
              ) : (
                <Trash2 className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground">
                {isEditing ? "Chỉnh sửa Thùng rác" : "Thêm Thùng rác Mới"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Cập nhật thông tin chi tiết bên dưới."
                  : "Điền thông tin để tạo điểm thu gom mới."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-muted/10">
          <form id="bin-form" onSubmit={onSubmit} className="space-y-6">
            {/* 1. Basic Info & Image */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image Upload */}
              <div className="space-y-2 shrink-0">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Ảnh hiện trạng
                </Label>
                <div className="group relative w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-input hover:border-primary hover:bg-accent transition-all bg-background shadow-sm cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload className="size-6 mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[1px]">
                    <ImageIcon className="size-6 mb-1" />
                    <span className="text-[9px] font-bold uppercase">
                      Thay đổi
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* General Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code */}
                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    Mã Thùng <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="code"
                    {...register("code")}
                    placeholder="VD: BIN-A01"
                    className={cn(errors.code && "border-destructive")}
                  />
                  {errors.code && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label
                    htmlFor="capacity"
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    Dung tích (Lít)
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    className={cn(errors.capacity && "border-destructive")}
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">
                    Loại rác
                  </Label>
                  <Controller
                    control={control}
                    name="binType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORGANIC">🍏 Hữu cơ</SelectItem>
                          <SelectItem value="INORGANIC">🧱 Vô cơ</SelectItem>
                          <SelectItem value="RECYCLE">♻️ Tái chế</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Collection Point (Tạm thời là Input, sau thay bằng Select) */}
                <div className="space-y-2">
                  <Label
                    htmlFor="collectionPointId"
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    Điểm tập kết ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="collectionPointId"
                    {...register("collectionPointId")}
                    placeholder="ID Collection Point"
                    className={cn(
                      errors.collectionPointId && "border-destructive",
                    )}
                  />
                  {errors.collectionPointId && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.collectionPointId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Location Section */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border">
              <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-primary">
                <MapPin className="size-4" /> Vị trí & Địa lý
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Vĩ độ (Lat)</Label>
                  <Input
                    type="number"
                    step="any"
                    {...register("latitude", { valueAsNumber: true })}
                  />
                  {errors.latitude && (
                    <p className="text-[10px] text-destructive">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Kinh độ (Long)</Label>
                  <Input
                    type="number"
                    step="any"
                    {...register("longitude", { valueAsNumber: true })}
                  />
                  {errors.longitude && (
                    <p className="text-[10px] text-destructive">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Địa chỉ chi tiết</Label>
                <Input
                  {...register("address")}
                  placeholder="123 Đường ABC, Phường X..."
                />
              </div>
            </div>

            {/* 3. IoT Status Section (Advanced) */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border bg-slate-50/50 p-4 rounded-lg">
              <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                <Battery className="size-4" /> Trạng thái IoT (Giả lập)
              </Label>

              <div className="grid grid-cols-2 gap-6">
                {/* Level */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs">Mức đầy hiện tại</Label>
                    <span className="text-xs font-mono font-bold">
                      {control._formValues.currentLevel}%
                    </span>
                  </div>
                  <Controller
                    control={control}
                    name="currentLevel"
                    render={({ field }) => (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    )}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs">Trạng thái hoạt động</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="FULL">Full</SelectItem>
                          <SelectItem value="MAINTENANCE">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="BROKEN">Broken</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Battery */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Battery className="size-3" /> Pin (%)
                  </Label>
                  <Input
                    type="number"
                    {...register("battery", { valueAsNumber: true })}
                    className="h-9"
                  />
                </div>

                {/* Temp */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Thermometer className="size-3" /> Nhiệt độ (°C)
                  </Label>
                  <Input
                    type="number"
                    {...register("temperature", { valueAsNumber: true })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">
                Ghi chú thêm
              </Label>
              <Textarea
                {...register("notes")}
                placeholder="Ghi chú về tình trạng thùng, lịch sử sửa chữa..."
                className="resize-none h-20 text-sm"
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background shrink-0 z-20">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="font-bold border-input bg-background hover:bg-accent hover:text-foreground"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="bin-form"
            disabled={isPending}
            className="font-bold shadow-md px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 min-w-[120px]"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo mới"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BinModal;
