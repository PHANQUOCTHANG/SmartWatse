import { useState } from "react";
import clsx from "clsx";

export default function TaskActionPanel({ bin }: { bin: any }) {
  const [fillLevel, setFillLevel] = useState<number>(0);
  const levels = [
    { label: "Trống (0%)", value: 0 },
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
  ];

  return (
    <div className="space-y-4">
      {/* Trạng thái Check-in */}
      <div className="flex justify-between items-center bg-green-50/50 border border-green-100 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Đã Check-in tại điểm
        </div>
        <span className="text-green-600 text-xs font-bold">10:42 AM</span>
      </div>

      {/* Chọn mức đầy */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Mức đầy sau thu gom</label>
        <div className="grid grid-cols-4 gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => setFillLevel(lvl.value)}
              className={clsx(
                "py-2 text-[11px] font-bold rounded-lg border transition-all",
                fillLevel === lvl.value 
                  ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nút Phụ (Ảnh & Báo cáo) */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center gap-1 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
          <span className="material-symbols-outlined">photo_camera</span>
          <span className="text-[11px] font-bold">Ảnh xác thực</span>
        </button>
        <button className="flex flex-col items-center gap-1 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
          <span className="material-symbols-outlined text-red-500">report_problem</span>
          <span className="text-[11px] font-bold">Báo cáo sự cố</span>
        </button>
      </div>

      {/* Nút Hoàn thành chính */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
        <span className="material-symbols-outlined">task_alt</span>
        Hoàn thành thu gom
      </button>
    </div>
  );
}