import { IBin } from "@/features/bins/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, Truck, Eye, Clock } from "lucide-react";
import { Popup } from "react-leaflet";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const BinPopup = ({ bin }: { bin: IBin }) => {
  // Logic màu sắc dựa trên mức độ đầy
  const isCritical = bin.currentLevel >= 90;
  const isFull = bin.currentLevel >= 75;

  const progressColor = isCritical
    ? "bg-rose-600"
    : isFull
      ? "bg-amber-500"
      : "bg-emerald-500";
  const badgeColor = isCritical
    ? "bg-rose-500"
    : isFull
      ? "bg-amber-500"
      : "bg-emerald-500";
  const statusText = isCritical
    ? "QUÁ TẢI"
    : isFull
      ? "SẮP ĐẦY"
      : "BÌNH THƯỜNG";

  return (
    <Popup
      className="custom-popup"
      maxWidth={340}
      minWidth={320}
      closeButton={false}
    >
      <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl font-sans border border-slate-100">
        {/* HEADER IMAGE */}
        <div className="relative h-36 w-full bg-slate-100 group">
          <img
            src={
              bin.coverImage ||
              "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400"
            }
            alt="Bin Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <Badge
            className={`absolute top-3 left-3 shadow-lg border-0 text-white font-bold ${badgeColor}`}
          >
            {statusText} ({bin.currentLevel}%)
          </Badge>

          {/* Nút đóng giả lập (vì Leaflet close button xấu) */}
          <div className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 cursor-pointer backdrop-blur-sm">
            {/* Icon X đóng popup */}
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-5 space-y-4">
          {/* Title & Address */}
          <div>
            <h3 className="text-lg font-black text-slate-800">
              Thùng rác #{bin.code}
            </h3>
            <div className="flex items-start gap-1.5 mt-1.5 text-slate-500 text-sm font-medium">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
              <span className="line-clamp-2">
                {bin.address || "Chưa cập nhật địa chỉ"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
              <span className="text-slate-500">Dung lượng</span>
              <span
                className={isCritical ? "text-rose-600" : "text-emerald-600"}
              >
                {bin.currentLevel}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                style={{ width: `${bin.currentLevel}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>
                Cập nhật:{" "}
                {bin.updatedAt
                  ? formatDistanceToNow(new Date(bin.updatedAt), {
                      addSuffix: true,
                      locale: vi,
                    })
                  : "Vừa xong"}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Loại rác
              </p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {bin.binType === "ORGANIC"
                  ? "Hữu cơ"
                  : bin.binType === "RECYCLE"
                    ? "Tái chế"
                    : "Vô cơ"}
              </p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Nhiệt độ
              </p>
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-700 mt-0.5">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" />{" "}
                {bin.temperature}°C
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-transform active:scale-95">
              <Truck className="w-4 h-4 mr-2" /> Điều phối xe
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 border-slate-200 hover:bg-slate-50"
            >
              <Eye className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};
