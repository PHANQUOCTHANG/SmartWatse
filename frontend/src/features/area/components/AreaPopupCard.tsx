import React from "react";
import { IArea } from "@/features/area/types";
import { Map, Users, Trash2, TrendingUp, ArrowRight } from "lucide-react";

interface Props {
  data: IArea;
  onViewDetails?: (id: string) => void;
}

export const AreaPopupCard: React.FC<Props> = ({ data, onViewDetails }) => {
  return (
    <div className="flex flex-col font-sans w-[280px] bg-white">
      {/* 1. HEADER SIMPLE */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-100 text-blue-600 rounded">
            <Map size={14} />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {data.type === "DISTRICT" ? "Quận / Huyện" : "Phường / Xã"}
          </span>
        </div>
        {/* Status Badge giả lập */}
        <div
          className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
          title="Hoạt động tốt"
        ></div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-extrabold text-slate-800 mb-1">
          {data.name}
        </h3>
        <p className="text-[10px] text-slate-400 mb-4">
          ID Quản lý:{" "}
          <span className="font-mono text-slate-500">{data.id}</span>
        </p>

        {/* Dashboard Grid - Giả lập số liệu cho đẹp vì IArea hiện tại chưa có */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatBox
            icon={<Users size={12} className="text-blue-500" />}
            label="Dân số"
            value="142k"
          />
          <StatBox
            icon={<Trash2 size={12} className="text-green-500" />}
            label="Điểm rác"
            value="35"
          />
          <StatBox
            icon={<TrendingUp size={12} className="text-orange-500" />}
            label="Hiệu suất"
            value="98%"
          />
          <StatBox label="Diện tích" value="7.7 km²" />
        </div>

        {/* 3. FOOTER ACTION */}
        <button
          onClick={() => onViewDetails && onViewDetails(data.id)}
          className="group w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
        >
          Xem báo cáo chi tiết
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};

// Sub-component nhỏ
const StatBox = ({ icon, label, value }: any) => (
  <div className="bg-slate-50 p-2 rounded border border-slate-100">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-[9px] text-slate-400 uppercase font-medium">
        {label}
      </span>
    </div>
    <div className="text-sm font-bold text-slate-700">{value}</div>
  </div>
);
