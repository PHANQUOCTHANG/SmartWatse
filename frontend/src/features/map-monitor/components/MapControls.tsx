import { Crosshair, RefreshCw } from "lucide-react";
import { MapFilterMode } from "../types/types";

interface Props {
  filterMode: MapFilterMode;
  setFilterMode: (mode: MapFilterMode) => void;
  onLocate: () => void;
  onRefresh: () => void;
}

export const MapControls = ({
  filterMode,
  setFilterMode,
  onLocate,
  onRefresh,
}: Props) => {
  return (
    <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2 pointer-events-auto">
      {/* Bộ lọc */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-1 flex flex-col gap-1">
        <button
          onClick={() => setFilterMode("ALL")}
          className={`px-3 py-1.5 text-xs font-medium rounded text-left flex items-center gap-2 ${
            filterMode === "ALL"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-gray-400" /> Tất cả
        </button>
        <button
          onClick={() => setFilterMode("FULL")}
          className={`px-3 py-1.5 text-xs font-medium rounded text-left flex items-center gap-2 ${
            filterMode === "FULL"
              ? "bg-yellow-50 text-yellow-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-yellow-500" /> Sắp đầy
        </button>
        <button
          onClick={() => setFilterMode("CRITICAL")}
          className={`px-3 py-1.5 text-xs font-medium rounded text-left flex items-center gap-2 ${
            filterMode === "CRITICAL"
              ? "bg-red-50 text-red-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Cần
          xử lý
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="bg-white p-2 rounded-lg shadow-lg text-gray-600 hover:text-blue-600 border border-gray-100"
          title="Làm mới"
        >
          <RefreshCw size={18} />
        </button>
        <button
          onClick={onLocate}
          className="bg-white p-2 rounded-lg shadow-lg text-gray-600 hover:text-blue-600 border border-gray-100"
          title="Vị trí của tôi"
        >
          <Crosshair size={18} />
        </button>
      </div>
    </div>
  );
};
