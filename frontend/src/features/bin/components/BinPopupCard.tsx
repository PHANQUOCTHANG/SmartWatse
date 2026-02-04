import React, { useMemo } from "react";
import { IBin } from "@/features/bin/types";
import {
  Truck,
  Eye,
  Thermometer,
  Battery,
  BatteryCharging,
  BatteryWarning,
  MapPin,
  Copy,
  Edit,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  data: IBin;
  onDispatch?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onEdit?: (bin: IBin) => void; // 🔥 Thêm action Edit
}

export const BinPopupCard: React.FC<Props> = ({
  data,
  onDispatch,
  onViewDetails,
  onEdit,
}) => {
  // 1. Tính toán trạng thái & Màu sắc
  const { statusColor, statusLabel, progressColor } = useMemo(() => {
    const level = data.currentLevel;
    if (data.status === "MAINTENANCE")
      return {
        statusColor: "bg-gray-500",
        statusLabel: "BẢO TRÌ",
        progressColor: "bg-gray-400",
      };
    if (level >= 90)
      return {
        statusColor: "bg-red-600",
        statusLabel: "QUÁ TẢI",
        progressColor: "bg-red-600",
      };
    if (level >= 75)
      return {
        statusColor: "bg-orange-500",
        statusLabel: "SẮP ĐẦY",
        progressColor: "bg-orange-500",
      };
    if (level >= 50)
      return {
        statusColor: "bg-yellow-500",
        statusLabel: "TRUNG BÌNH",
        progressColor: "bg-yellow-500",
      };
    return {
      statusColor: "bg-green-600",
      statusLabel: "BÌNH THƯỜNG",
      progressColor: "bg-green-600",
    };
  }, [data.currentLevel, data.status]);

  // 2. Icon Pin
  const BatteryIcon = useMemo(() => {
    const bat = data.battery ?? 100;
    if (bat < 20) return BatteryWarning;
    if (bat > 90) return BatteryCharging;
    return Battery;
  }, [data.battery]);

  // 3. Xử lý Copy ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(data.code);
    toast.success(`Đã sao chép mã: ${data.code}`);
  };

  // 4. Format thời gian (VD: 5 phút trước)
  const lastUpdated = useMemo(() => {
    if (!data.lastCollected) return "Chưa cập nhật";
    const date = new Date(data.lastCollected);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  }, [data.lastCollected]);

  return (
    <div className="flex flex-col w-[320px] font-sans bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200">
      {/* --- HEADER: ẢNH & STATUS --- */}
      <div className="relative h-36 w-full bg-slate-100 group">
        <img
          src={
            data.coverImage
              ? typeof data.coverImage === "string"
                ? data.coverImage
                : URL.createObjectURL(data.coverImage)
              : "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400&auto=format&fit=crop"
          }
          alt="Bin Cover"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay Gradient để text dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge Trạng thái */}
        <div
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold text-white shadow-sm flex items-center gap-1.5 backdrop-blur-md",
            statusColor,
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {statusLabel}
        </div>

        {/* Info IoT: Pin & Nhiệt độ (Nổi trên ảnh) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-white text-[10px] font-medium border border-white/10">
            <BatteryIcon
              size={12}
              className={
                data.battery && data.battery < 20
                  ? "text-red-400"
                  : "text-green-400"
              }
            />
            {data.battery ?? 100}%
          </div>
        </div>

        {/* Địa chỉ rút gọn trên ảnh */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs font-medium opacity-90 truncate">
            <MapPin size={12} className="text-blue-400 shrink-0" />
            <span className="truncate">
              {data.address || "Đang cập nhật vị trí..."}
            </span>
          </div>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="p-4 space-y-4">
        {/* Title & Actions Row */}
        <div className="flex items-start justify-between">
          <div>
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={handleCopyId}
            >
              <h3 className="font-bold text-lg text-slate-800 leading-none">
                {data.code}
              </h3>
              <Copy
                size={12}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              {data.binType === "ORGANIC"
                ? "Rác Hữu Cơ"
                : data.binType === "RECYCLE"
                  ? "Rác Tái Chế"
                  : "Rác Vô Cơ"}
              {" • "}
              {data.capacity} Lít
            </p>
          </div>

          {/* Nút Edit nhỏ gọn */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-100 rounded-full text-slate-500"
            onClick={() => onEdit?.(data)}
          >
            <Edit size={16} />
          </Button>
        </div>

        {/* Progress Bar - Level Rác */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">Mức độ đầy</span>
            <span
              className={cn(
                data.currentLevel >= 80 ? "text-red-600" : "text-slate-700",
              )}
            >
              {data.currentLevel}%
            </span>
          </div>
          {/* Custom Progress Bar */}
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out rounded-full",
                progressColor,
              )}
              style={{ width: `${data.currentLevel}%` }}
            />
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> Cập nhật: {lastUpdated}
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
            <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
              <Thermometer size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">
                Nhiệt độ
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {data.temperature ?? 30}°C
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
              <Trash2 size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">
                Khối lượng
              </p>
              <p className="text-xs font-semibold text-slate-700">
                ~{" "}
                {((data.currentLevel / 100) * (data.capacity * 0.4)).toFixed(1)}{" "}
                kg
              </p>
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="pt-2 flex gap-2">
          <Button
            onClick={() => onDispatch && onDispatch(data.id)}
            disabled={data.currentLevel < 50} // Chỉ cho phép điều phối nếu rác > 50%
            className={cn(
              "flex-1 text-xs font-bold shadow-md transition-all active:scale-95",
              data.currentLevel >= 80
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700",
            )}
            size="sm"
          >
            <Truck size={14} className="mr-2" />
            {data.currentLevel >= 80 ? "Thu gom khẩn cấp" : "Điều phối xe"}
          </Button>

          <Button
            onClick={() => onViewDetails && onViewDetails(data.id)}
            variant="outline"
            size="sm"
            className="aspect-square p-0 w-9 hover:bg-slate-100 text-slate-600"
          >
            <Eye size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
