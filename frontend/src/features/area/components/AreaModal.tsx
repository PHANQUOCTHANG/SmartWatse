import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Edit,
  Plus,
  Building2, // Icon Quận
  Map, // Icon Phường
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hooks
import { useAreaModalLogic } from "../hooks/useAreaModalLogic"; // Bạn cần tạo file này tương tự useBinModalLogic
import { useParentAreas } from "../hooks/useAreas"; // Hook lấy danh sách Quận để chọn

// Types
import { IArea, AreaType } from "../types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaToEdit?: IArea | null;
}

const AreaModal: React.FC<AreaModalProps> = (props) => {
  const { isOpen, onClose, areaToEdit } = props;

  // 1. Logic Form (Submit, Validation)
  const {
    form: {
      register,
      control,
      watch,
      formState: { errors },
    },
    isEditing,
    isPending,
    onSubmit,
  } = useAreaModalLogic(props);

  // 2. Data cho Dropdown (Lấy danh sách các Quận để làm cha)
  const { data: parentAreas, isLoading: isLoadingParents } = useParentAreas();

  // Watch giá trị Type để ẩn/hiện field ParentId
  const selectedType = watch("type");

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
              {isEditing ? (
                <Edit className="size-5" />
              ) : (
                <Plus className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground">
                {isEditing ? "Cập nhật Khu vực" : "Thêm Khu vực Mới"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Chỉnh sửa thông tin hành chính."
                  : "Thiết lập đơn vị hành chính mới cho hệ thống."}
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
          <form id="area-form" onSubmit={onSubmit} className="space-y-6">
            {/* 1. Tên & Loại */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <MapPin className="size-3.5" /> Tên khu vực{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ví dụ: Quận 1, Phường Bến Nghé..."
                  className={cn(
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                />
                {errors.name && (
                  <p className="text-[10px] text-destructive font-bold animate-in slide-in-from-left-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Map className="size-3.5" /> Cấp hành chính{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={cn(errors.type && "border-destructive")}
                      >
                        <SelectValue placeholder="Chọn cấp hành chính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AreaType.DISTRICT}>
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-blue-500" />
                            <span>Quận / Huyện</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={AreaType.WARD}>
                          <div className="flex items-center gap-2">
                            <Map className="size-4 text-green-500" />
                            <span>Phường / Xã</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-[10px] text-destructive font-bold">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Parent Selection (Logic hiển thị động) */}
            <div
              className={cn(
                "space-y-4 pt-4 border-t border-dashed border-border transition-all duration-300",
                selectedType === AreaType.WARD
                  ? "opacity-100"
                  : "opacity-50 grayscale pointer-events-none",
              )}
            >
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary">
                  <ArrowUpRight className="size-3.5" /> Trực thuộc Quận/Huyện
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  {selectedType === AreaType.WARD
                    ? "Bắt buộc: Chọn Quận/Huyện quản lý Phường/Xã này."
                    : "Không khả dụng: Cấp Quận/Huyện là cấp cao nhất."}
                </p>

                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <Select
                      // Nếu không phải là Ward thì disable hoặc reset value
                      disabled={
                        selectedType !== AreaType.WARD || isLoadingParents
                      }
                      onValueChange={field.onChange}
                      value={field.value || undefined} // Handle null value
                    >
                      <SelectTrigger
                        className={cn(errors.parentId && "border-destructive")}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingParents
                              ? "Đang tải danh sách..."
                              : "Chọn đơn vị trực thuộc"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {parentAreas?.map((parent: any) => (
                          <SelectItem key={parent.value} value={parent.value}>
                            {parent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.parentId && selectedType === AreaType.WARD && (
                  <p className="text-[10px] text-destructive font-bold">
                    {errors.parentId.message}
                  </p>
                )}
              </div>
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
            form="area-form"
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

export default AreaModal;
