import React, { useMemo, useState } from "react";
import {
  CollectionPointStatus,
  ICollectionPoint,
} from "@/features/collection-points/types";
import {
  Warehouse,
  MapPin,
  CalendarDays,
  Clock,
  Edit,
  Weight,
  Info,
  Navigation,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  data: ICollectionPoint;
  onViewSchedule?: (id: string) => void;
  onEdit?: (point: ICollectionPoint) => void;
}

export const CollectionPointPopupCard: React.FC<Props> = ({
  data,
  onViewSchedule,
  onEdit,
}) => {
  const [imgError, setImgError] = useState(false);

  // 1. Mockup số liệu (Nên lấy từ props data nếu backend đã có)
  const currentLoad = 65;
  const maxCapacity = data.capacity || 100;

  // 2. Xử lý hiển thị ảnh an toàn (URL string hoặc File object)
  const imageUrl = useMemo(() => {
    if (imgError || !data.image) return null;
    if (data.image instanceof File) return URL.createObjectURL(data.image);
    return data.image; // String URL
  }, [data.image, imgError]);

  // 3. Logic màu sắc và Icon trạng thái
  const statusConfig = useMemo(() => {
    switch (data.status) {
      case CollectionPointStatus.ACTIVE:
        return {
          label: "ĐANG HOẠT ĐỘNG",
          colorClass: "bg-emerald-500 hover:bg-emerald-600",
          icon: <CheckCircle2 size={10} className="mr-1" />,
          borderClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
        };
      case CollectionPointStatus.MAINTENANCE:
        return {
          label: "ĐANG BẢO TRÌ",
          colorClass: "bg-amber-500 hover:bg-amber-600",
          icon: <AlertTriangle size={10} className="mr-1" />,
          borderClass: "border-amber-200 bg-amber-50 text-amber-700",
        };
      case CollectionPointStatus.INACTIVE:
        return {
          label: "NGƯNG HOẠT ĐỘNG",
          colorClass: "bg-slate-500 hover:bg-slate-600",
          icon: <XCircle size={10} className="mr-1" />,
          borderClass: "border-slate-200 bg-slate-50 text-slate-700",
        };
      default:
        return {
          label: "HOẠT ĐỘNG",
          colorClass: "bg-blue-500 hover:bg-blue-600",
          icon: <CheckCircle2 size={10} className="mr-1" />,
          borderClass: "border-blue-200 bg-blue-50 text-blue-700",
        };
    }
  }, [data.status]);

  // 4. Logic màu Progress Bar
  const progressColor = useMemo(() => {
    if (currentLoad >= 90) return "bg-red-500";
    if (currentLoad >= 70) return "bg-orange-500";
    return "bg-indigo-500";
  }, [currentLoad]);

  // Actions
  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    toast.success("Đã sao chép mã trạm: " + data.code);
  };

  const handleOpenMap = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`,
      "_blank",
    );
  };

  return (
    <div className="flex flex-col font-sans w-[320px] bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 ring-1 ring-slate-100">
      {/* --- 1. HEADER HERO SECTION --- */}
      <div className="relative h-36 w-full group overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <ImageIcon size={32} strokeWidth={1.5} />
            <span className="text-[10px] uppercase font-bold mt-2 tracking-wider">
              Không có hình ảnh
            </span>
          </div>
        )}

        {/* Gradient Overlay tốt hơn cho text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Status Badge (Floating) */}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "text-[10px] font-bold shadow-sm backdrop-blur-md px-2 py-0.5 border-0 flex items-center",
              statusConfig.colorClass,
            )}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>

        {/* Title Block */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              <Warehouse size={12} /> Trạm trung chuyển
            </div>
            {/* Code Badge Clickable */}
            <div
              onClick={handleCopyCode}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white font-mono cursor-pointer transition-colors"
              title="Click để copy mã"
            >
              {data.code} <Copy size={8} />
            </div>
          </div>
          <h3
            className="text-white font-bold text-lg leading-tight truncate drop-shadow-md"
            title={data.name}
          >
            {data.name}
          </h3>
        </div>
      </div>

      {/* --- 2. BODY CONTENT --- */}
      <div className="p-4 space-y-4 bg-white relative z-10">
        {/* Địa chỉ & Chỉ đường */}
        <div className="flex gap-3">
          <div className="mt-0.5 p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 h-fit">
            <MapPin size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wide">
                Vị trí
              </p>
              <button
                onClick={handleOpenMap}
                className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                Chỉ đường <Navigation size={10} />
              </button>
            </div>
            <p
              className="text-sm text-slate-700 leading-snug line-clamp-2"
              title={data.address}
            >
              {data.address || "Chưa cập nhật địa chỉ cụ thể"}
            </p>
          </div>
        </div>

        {/* Stats Grid (Thông số) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-2 text-slate-400">
              <Weight size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                Sức chứa
              </span>
            </div>
            <div className="text-base font-bold text-slate-700">
              {maxCapacity}{" "}
              <span className="text-xs font-medium text-slate-400">Tấn</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-2 text-slate-400">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                Giờ mở cửa
              </span>
            </div>
            <div className="text-sm font-bold text-slate-700 whitespace-nowrap">
              05:00 - 22:00
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Info size={12} className="text-slate-400" /> Công suất hiện tại
            </span>
            <span
              className={cn(
                "text-sm font-bold",
                currentLoad > 80 ? "text-red-600" : "text-slate-700",
              )}
            >
              {currentLoad}%
            </span>
          </div>
          <Progress
            value={currentLoad}
            className="h-2.5 bg-slate-100 rounded-full"
            indicatorClassName={cn(
              "transition-all duration-500",
              progressColor,
            )}
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>Trống</span>
            <span>Đầy</span>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* --- 3. FOOTER ACTIONS --- */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewSchedule && onViewSchedule(data.id)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 shadow-sm transition-all"
          >
            <CalendarDays size={14} className="mr-2" />
            Lịch thu gom
          </Button>

          <Button
            onClick={() => onEdit?.(data)}
            variant="outline"
            className="h-9 w-9 p-0 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200"
            title="Chỉnh sửa thông tin"
          >
            <Edit size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
