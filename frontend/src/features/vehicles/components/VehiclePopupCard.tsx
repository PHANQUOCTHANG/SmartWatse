import React, { useMemo } from "react";
import {
  IVehicle,
  VehicleStatus,
  VehicleType,
} from "@/features/vehicles/types";
import {
  Truck,
  User,
  Gauge,
  Navigation,
  Fuel,
  MoreHorizontal,
  Clock,
  AlertCircle,
  Copy,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Thêm Avatar
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns"; // Cần cài: npm i date-fns
import { vi } from "date-fns/locale"; // Tiếng Việt
import { toast } from "sonner";

interface Props {
  data: IVehicle;
  onViewRoute?: (vehicle: IVehicle) => void;
  onDetails?: (vehicle: IVehicle) => void;
}

export const VehiclePopupCard: React.FC<Props> = ({
  data,
  onViewRoute,
  onDetails,
}) => {
  // 1. Tính toán & Format
  const loadPercent = Math.round((data.currentLoad / data.capacity) * 100);
  const fuelPercent = data.fuelLevel;

  // Format thời gian cập nhật (VD: "vừa xong", "5 phút trước")
  const lastUpdatedText = useMemo(() => {
    if (!data.updatedAt) return "Không rõ";
    return formatDistanceToNow(new Date(data.updatedAt), {
      addSuffix: true,
      locale: vi,
    });
  }, [data.updatedAt]);

  // 2. Logic trạng thái
  const statusInfo = useMemo(() => {
    switch (data.status) {
      case VehicleStatus.IN_USE:
        return {
          label: "ĐANG CHẠY",
          color: "bg-emerald-500",
          text: "text-emerald-600 bg-emerald-50 border-emerald-100",
        };
      case VehicleStatus.AVAILABLE:
        return {
          label: "ĐANG DỪNG",
          color: "bg-blue-500",
          text: "text-blue-600 bg-blue-50 border-blue-100",
        };
      case VehicleStatus.FULL:
        return {
          label: "ĐẦY RÁC",
          color: "bg-red-500",
          text: "text-red-600 bg-red-50 border-red-100",
        };
      case VehicleStatus.MAINTENANCE:
        return {
          label: "BẢO TRÌ",
          color: "bg-amber-500",
          text: "text-amber-600 bg-amber-50 border-amber-100",
        };
      default:
        return {
          label: "MẤT TÍN HIỆU",
          color: "bg-slate-500",
          text: "text-slate-600 bg-slate-100 border-slate-200",
        };
    }
  }, [data.status]);

  // Action: Copy biển số
  const handleCopyPlate = () => {
    navigator.clipboard.writeText(data.plateNumber);
    toast.success(`Đã sao chép: ${data.plateNumber}`);
  };

  return (
    <div className="flex flex-col w-[320px] font-sans bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 ring-1 ring-slate-100/50">
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl border shadow-sm transition-colors",
              statusInfo.text,
            )}
          >
            <Truck size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-lg text-slate-800 leading-none tracking-tight">
                {data.plateNumber}
              </h3>
              <button
                onClick={handleCopyPlate}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Sao chép biển số"
              >
                <Copy size={12} />
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1.5 flex items-center gap-1">
              {data.type === VehicleType.COMPACTOR ? "Xe Ép Rác" : "Xe Thu Gom"}
            </span>
          </div>
        </div>

        <Badge
          className={cn(
            "text-[9px] font-bold px-2 py-0.5 shadow-sm border-0",
            statusInfo.color,
          )}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* --- BODY --- */}
      <div className="p-4 space-y-4">
        {/* Driver Info Card (Nâng cấp) */}
        <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50/30">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${data.driverName}&background=random`}
            />
            <AvatarFallback>
              <User size={14} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Tài xế
            </p>
            <p className="text-xs font-bold text-slate-700 truncate">
              {data.driverName || "Chưa phân công"}
            </p>
          </div>
          {/* Nút gọi điện nhanh (Giả lập) */}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-full"
          >
            <Phone size={14} />
          </Button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold mb-1">
              <Gauge size={12} className="text-blue-500" /> Tốc độ
            </div>
            <div className="text-sm font-bold text-slate-800">
              {data.speed || 0}{" "}
              <span className="text-[10px] font-normal text-slate-500">
                km/h
              </span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold mb-1">
              <Navigation size={12} className="text-indigo-500" /> Hướng
            </div>
            <div className="text-sm font-bold text-slate-800">
              {data.coordinates?.heading || 0}°{" "}
              <span className="text-[10px] font-normal text-slate-500">ĐB</span>
            </div>
          </div>
        </div>

        {/* Status Bars (Có tooltip hiển thị số liệu thực) */}
        <div className="space-y-3 pt-1">
          {/* Load */}
          <div className="space-y-1.5 group">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Truck size={12} className="text-slate-400" /> Tải trọng
              </span>
              <span
                className={cn(
                  "font-bold",
                  loadPercent > 90 ? "text-red-600" : "text-slate-700",
                )}
              >
                {loadPercent}%
              </span>
            </div>
            <Progress
              value={loadPercent}
              className="h-2 bg-slate-100"
              indicatorClassName={cn(
                loadPercent > 90 ? "bg-red-500" : "bg-blue-600",
              )}
            />
            {/* Hover tooltip hiển thị kg cụ thể */}
            <div className="hidden group-hover:block text-[9px] text-center text-slate-500 bg-slate-100 rounded py-0.5 absolute w-full left-0 -mt-8 shadow-sm">
              {data.currentLoad} / {data.capacity} kg
            </div>
          </div>

          {/* Fuel */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Fuel size={12} className="text-slate-400" /> Nhiên liệu
              </span>
              <span
                className={cn(
                  "font-bold",
                  fuelPercent < 20 ? "text-red-600" : "text-emerald-600",
                )}
              >
                {fuelPercent}%
              </span>
            </div>
            <Progress
              value={fuelPercent}
              className="h-2 bg-slate-100"
              indicatorClassName={cn(
                fuelPercent < 20
                  ? "bg-red-500 animate-pulse"
                  : "bg-emerald-500",
              )}
            />
          </div>
        </div>

        {/* Footer Info & Actions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock size={10} /> Cập nhật:{" "}
              <span className="text-slate-600 font-medium">
                {lastUpdatedText}
              </span>
            </span>
            {data.status === VehicleStatus.OFFLINE && (
              <span className="flex items-center gap-1 text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
                <AlertCircle size={10} /> Mất kết nối
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onViewRoute && onViewRoute(data)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-8 shadow-sm"
            >
              Xem lộ trình
            </Button>
            <Button
              onClick={() => onDetails && onDetails(data)}
              variant="outline"
              className="h-8 w-8 p-0 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            >
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
