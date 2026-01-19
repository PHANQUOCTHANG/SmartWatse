import { Trash2, AlertTriangle, Truck } from "lucide-react";
import { IBin } from "@/features/bins/types";
import { useMemo } from "react";
import { MapFilterMode } from "../types/types";

// --- COMPONENT 1: THANH THỐNG KÊ DƯỚI ĐÁY ---
export const StatsPanel = ({ bins }: { bins: IBin[] }) => {
  // Tính toán số liệu thực tế từ danh sách bins
  const stats = useMemo(() => {
    const total = bins.length;
    const critical = bins.filter(
      (b) => b.status === "OVERLOAD" || b.status === "FULL",
    ).length;
    const activeTrucks = 12; // Giả lập số xe (thường lấy từ API khác)

    return { total, critical, activeTrucks };
  }, [bins]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400] w-full max-w-5xl px-4 pointer-events-none">
      <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
        {/* Card 1: Tổng số */}
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tổng số thùng rác
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">
              {stats.total.toLocaleString()}
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
            <Trash2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Cảnh báo (Đỏ) */}
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-l-4 border-l-rose-500 p-4 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              Cần xử lý gấp
            </p>
            <p className="text-3xl font-black text-rose-600 mt-1">
              {stats.critical}
            </p>
          </div>
          <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shadow-inner animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Xe hoạt động */}
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              Xe đang hoạt động
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">
              {stats.activeTrucks}
            </p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT 2: BỘ LỌC GÓC TRÊN PHẢI ---
interface FilterProps {
  currentMode: MapFilterMode;
  setMode: (mode: MapFilterMode) => void;
}

export const FilterBadges = ({ currentMode, setMode }: FilterProps) => {
  const filters = [
    { key: "ALL", label: "Tất cả", color: "bg-slate-500" },
    { key: "NORMAL", label: "Trống (<50%)", color: "bg-emerald-500" },
    { key: "FULL", label: "Sắp đầy (50-80%)", color: "bg-amber-500" },
    { key: "CRITICAL", label: "Quá tải (>80%)", color: "bg-rose-500" },
  ];

  return (
    <div className="absolute top-4 right-16 z-[400] flex flex-wrap gap-2 justify-end pointer-events-auto">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setMode(f.key as MapFilterMode)}
          className={`
            group flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all
            ${
              currentMode === f.key
                ? "bg-white border-slate-300 ring-2 ring-slate-200 translate-y-0.5"
                : "bg-white/90 border-transparent hover:bg-white"
            }
          `}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${f.color} ${currentMode === f.key ? "animate-pulse" : ""}`}
          />
          <span
            className={`text-xs font-bold ${currentMode === f.key ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}
          >
            {f.label}
          </span>
        </button>
      ))}
    </div>
  );
};
