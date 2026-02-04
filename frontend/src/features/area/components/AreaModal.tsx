import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Edit,
  Plus,
  Building2,
  Map as MapIcon,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

import { useAreaModalLogic } from "../hooks/useAreaModalLogic";
import { IArea, AreaType } from "../types";
import { AreaBoundaryEditor } from "@/features/area/components/AreaBoundaryEditor";
import { MapAreaSelect } from "@/features/area/components/MapAreaSelect";

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaToEdit?: IArea | null;
}

const AreaModal: React.FC<AreaModalProps> = (props) => {
  const { isOpen, onClose, areaToEdit } = props;

  const {
    form: {
      register,
      control,
      watch,
      formState: { errors },
    },
    isEditing,
    isPending,
    existingAreas,
    onSubmit,
  } = useAreaModalLogic(props);

  const selectedType = watch("type");
  const parentId = watch("parentId"); // 🔥 Theo dõi parentId thay đổi

  // --- LOGIC: Tìm Parent Area để lấy ranh giới ---
  // existingAreas chứa toàn bộ danh sách (do useQuery lấy limit 1000)
  const parentArea = useMemo(
    () => existingAreas.find((a) => a.id === parentId),
    [existingAreas, parentId],
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative z-[101] w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
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
              {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Cập nhật Khu vực" : "Thêm Khu vực Mới"}
              </h3>
              <p className="text-xs text-gray-500">
                Định nghĩa ranh giới hành chính
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} className="text-gray-400" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form
            id="area-form"
            onSubmit={onSubmit}
            className="flex flex-col lg:flex-row gap-6 h-full"
          >
            {/* CỘT TRÁI: INPUTS */}
            <div className="w-full lg:w-1/3 space-y-5">
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold uppercase text-gray-500">
                  Thông tin chung
                </h4>
                <div className="space-y-2">
                  <Label className="text-xs">
                    Tên khu vực <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("name")}
                    placeholder="VD: Phường Bến Nghé"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Cấp hành chính</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value={AreaType.DISTRICT}>
                            <div className="flex gap-2">
                              <Building2 size={14} />
                              Quận/Huyện
                            </div>
                          </SelectItem>
                          <SelectItem value={AreaType.WARD}>
                            <div className="flex gap-2">
                              <MapIcon size={14} />
                              Phường/Xã
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* 🔥 PARENT SELECTOR (MAP BASED) */}
                <div
                  className={cn(
                    "space-y-2 transition-all",
                    selectedType === AreaType.WARD
                      ? "opacity-100"
                      : "opacity-50 pointer-events-none",
                  )}
                >
                  <Label className="text-xs flex items-center gap-1">
                    <ArrowUpRight size={12} /> Trực thuộc Quận/Huyện
                  </Label>
                  <Controller
                    control={control}
                    name="parentId"
                    render={({ field, fieldState }) => (
                      <MapAreaSelect
                        value={field.value || ""}
                        onChange={(val) => {
                          field.onChange(val);
                        }}
                        typeToSelect={AreaType.DISTRICT}
                        disabled={selectedType !== AreaType.WARD}
                        error={fieldState.error?.message}
                        placeholder="Chọn Quận quản lý..."
                      />
                    )}
                  />
                  {parentArea && (
                    <div className="text-[10px] text-green-600 flex items-center gap-1 bg-green-50 p-2 rounded border border-green-100">
                      <Check size={12} /> Đã chọn: <b>{parentArea.name}</b> (Xem
                      khung đỏ bên phải)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: MAP EDITOR */}
            <div className="w-full lg:w-2/3 flex flex-col h-[500px] lg:h-auto">
              <Label className="text-xs font-bold uppercase text-gray-600 mb-2 flex justify-between">
                <span>
                  Ranh giới địa lý <span className="text-red-500">*</span>
                </span>
                {errors.boundary && (
                  <span className="text-red-500 normal-case">
                    {errors.boundary.message}
                  </span>
                )}
              </Label>

              <div className="flex-1 rounded-xl overflow-hidden border border-gray-300 shadow-inner relative">
                <Controller
                  control={control}
                  name="boundary"
                  render={({ field }) => (
                    <AreaBoundaryEditor
                      value={field.value}
                      onChange={field.onChange}
                      existingAreas={existingAreas}
                      parentBoundary={parentArea?.boundary} // 🔥 Truyền ranh giới cha vào để vẽ tham chiếu
                      error={errors.boundary?.message}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <Button variant="outline" onClick={onClose} className="bg-white">
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="area-form"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 font-bold min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}{" "}
            {isEditing ? "Lưu thay đổi" : "Tạo khu vực"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AreaModal;
