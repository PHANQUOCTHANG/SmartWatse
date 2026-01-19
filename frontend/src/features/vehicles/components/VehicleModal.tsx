import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Edit,
  Plus,
  Truck, // Icon cho Header & Type
  Fuel, // Icon Nhiên liệu
  Weight, // Icon Tải trọng
  Activity, // Icon Trạng thái
  CreditCard, // Icon Biển số
  Bike, // Icon Xe thu gom
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hooks
import { useVehicleModalLogic } from "../hooks/useVehicleModalLogic"; // Hook logic xử lý form

// Types
import { IVehicle, VehicleType, VehicleStatus } from "../types";

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

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: IVehicle | null;
}

const VehicleModal: React.FC<VehicleModalProps> = (props) => {
  const { isOpen, onClose, vehicleToEdit } = props;

  // Logic Form (Submit, Validation) lấy từ Hook
  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    isEditing,
    isPending,
    onSubmit,
  } = useVehicleModalLogic(props);

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
                <Plus className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground">
                {isEditing ? "Cập nhật Phương tiện" : "Thêm Phương tiện Mới"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Điều chỉnh thông số kỹ thuật hoặc trạng thái."
                  : "Đăng ký xe mới vào đội ngũ thu gom rác."}
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
          <form id="vehicle-form" onSubmit={onSubmit} className="space-y-6">
            {/* GROUP 1: THÔNG TIN CƠ BẢN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Plate Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="plateNumber"
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <CreditCard className="size-3.5" /> Biển số xe{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="plateNumber"
                  {...register("plateNumber")}
                  placeholder="VD: 59A-123.45"
                  className={cn(
                    errors.plateNumber &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                />
                {errors.plateNumber && (
                  <p className="text-[10px] text-destructive font-bold animate-in slide-in-from-left-1">
                    {errors.plateNumber.message}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="size-3.5" /> Loại xe{" "}
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
                        <SelectValue placeholder="Chọn loại xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={VehicleType.COMPACTOR}>
                          <div className="flex items-center gap-2">
                            <Truck className="size-4 text-orange-500" />
                            <span>Xe Ép Rác (Chuyên dụng)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VehicleType.TRUCK}>
                          <div className="flex items-center gap-2">
                            <Truck className="size-4 text-blue-500" />
                            <span>Xe Tải Thùng</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VehicleType.COLLECTOR}>
                          <div className="flex items-center gap-2">
                            <Bike className="size-4 text-emerald-500" />
                            <span>Xe Thu Gom Nhỏ</span>
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

              {/* Capacity */}
              <div className="space-y-2">
                <Label
                  htmlFor="capacity"
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Weight className="size-3.5" /> Tải trọng tối đa (Kg){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register("capacity")}
                  placeholder="VD: 5000"
                  className={cn(errors.capacity && "border-destructive")}
                />
                {errors.capacity && (
                  <p className="text-[10px] text-destructive font-bold">
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="size-3.5" /> Trạng thái
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={VehicleStatus.AVAILABLE}>
                          🟢 Sẵn sàng
                        </SelectItem>
                        <SelectItem value={VehicleStatus.IN_USE}>
                          🔵 Đang làm việc
                        </SelectItem>
                        <SelectItem value={VehicleStatus.MAINTENANCE}>
                          🟠 Bảo trì
                        </SelectItem>
                        <SelectItem value={VehicleStatus.OFFLINE}>
                          ⚪ Mất tín hiệu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* GROUP 2: THÔNG SỐ VẬN HÀNH (Chỉ hiển thị rõ khi Edit hoặc optional khi Create) */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border bg-slate-50/50 p-4 rounded-lg">
              <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-indigo-600 mb-2">
                <Activity className="size-4" /> Thông số vận hành hiện tại
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Fuel Level */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Fuel className="size-3" /> Mức nhiên liệu (%)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      {...register("fuelLevel")}
                      min={0}
                      max={100}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                      %
                    </span>
                  </div>
                  {errors.fuelLevel && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.fuelLevel.message}
                    </p>
                  )}
                </div>

                {/* Current Load */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Weight className="size-3" /> Tải trọng hiện tại (Kg)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      {...register("currentLoad")}
                      min={0}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                      kg
                    </span>
                  </div>
                  {errors.currentLoad && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.currentLoad.message}
                    </p>
                  )}
                </div>
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
            form="vehicle-form"
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

export default VehicleModal;
