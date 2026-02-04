import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  Edit,
  Plus,
  Truck,
  Fuel,
  Weight,
  CreditCard,
  Bike,
  LayoutGrid,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types

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
import { MapAreaSelect } from "@/features/area/components/MapAreaSelect";
import { MapCoordinatePicker } from "@/features/map-monitor/components/MapCoordinatePicker";
import { useVehicleModalLogic } from "@/features/vehicles/hooks/useVehicleModalLogic";
import {
  IVehicle,
  VehicleStatus,
  VehicleType,
} from "@/features/vehicles/types";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: IVehicle | null;
}

const VehicleModal: React.FC<VehicleModalProps> = (props) => {
  const { isOpen, onClose, vehicleToEdit } = props;

  const {
    form: {
      register,
      control,
      setValue,
      trigger,
      formState: { errors },
    },
    isEditing,
    isPending,
    onSubmit,
  } = useVehicleModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative z-[101] w-full max-w-3xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
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
                Quản lý đội xe và phân công khu vực hoạt động
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-muted/10">
          <form id="vehicle-form" onSubmit={onSubmit} className="space-y-6">
            {/* GROUP 1: THÔNG TIN CHÍNH (BIỂN SỐ & KHU VỰC) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="size-3.5" /> Biển số xe{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("plateNumber")}
                  placeholder="VD: 59A-123.45"
                  className={cn(errors.plateNumber && "border-destructive")}
                />
                {errors.plateNumber && (
                  <p className="text-[10px] text-destructive">
                    {errors.plateNumber.message}
                  </p>
                )}
              </div>

              {/* 🔥 AREA SELECT */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutGrid className="size-3.5" /> Khu vực hoạt động{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="areaId"
                  render={({ field, fieldState }) => (
                    <MapAreaSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      placeholder="Chọn Quận/Huyện hoạt động..."
                    />
                  )}
                />
              </div>
            </div>

            {/* GROUP 2: VỊ TRÍ HIỆN TẠI (MAP PICKER) */}
            <div className="space-y-2 pt-2 border-t border-dashed">
              <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
                <MapPin className="size-3.5" /> Vị trí hiện tại (GPS)
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
                        }}
                        error={errors.latitude?.message}
                        placeholder="Chọn vị trí hiện tại của xe..."
                      />
                    )}
                  />
                )}
              />
            </div>

            {/* GROUP 3: THÔNG SỐ KỸ THUẬT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2 border-t border-dashed">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Loại xe</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
                        <SelectItem value={VehicleType.COMPACTOR}>
                          <div className="flex gap-2">
                            <Truck className="size-4 text-orange-500" /> Xe Ép
                            Rác
                          </div>
                        </SelectItem>
                        <SelectItem value={VehicleType.TRUCK}>
                          <div className="flex gap-2">
                            <Truck className="size-4 text-blue-500" /> Xe Tải
                            Thùng
                          </div>
                        </SelectItem>
                        <SelectItem value={VehicleType.COLLECTOR}>
                          <div className="flex gap-2">
                            <Bike className="size-4 text-emerald-500" /> Xe Thu
                            Gom Nhỏ
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">
                  Tải trọng (Kg)
                </Label>
                <Input
                  type="number"
                  {...register("capacity", {
                    onChange: () => trigger("currentLoad"),
                  })}
                  placeholder="VD: 5000"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">
                  Trạng thái
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
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
                          ⚪ Offline
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* GROUP 4: TRẠNG THÁI VẬN HÀNH (OPTIONAL) */}
            <div className="grid grid-cols-2 gap-5 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-2">
                <Label className="text-xs flex gap-1">
                  <Fuel className="size-3" /> Nhiên liệu (%)
                </Label>
                <Input
                  type="number"
                  {...register("fuelLevel")}
                  min={0}
                  max={100}
                  className="bg-white"
                />
                {errors.fuelLevel && (
                  <p className="text-[10px] text-red-500 font-medium animate-pulse">
                    {errors.fuelLevel.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex gap-1">
                  <Weight className="size-3" /> Tải hiện tại (Kg)
                </Label>
                <Input
                  type="number"
                  {...register("currentLoad")}
                  min={0}
                  className="bg-white"
                />
                {errors.currentLoad && (
                  <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                    ⚠️ {errors.currentLoad.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background shrink-0">
          <Button variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="vehicle-form"
            disabled={isPending}
            className="bg-primary text-primary-foreground min-w-[120px]"
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
