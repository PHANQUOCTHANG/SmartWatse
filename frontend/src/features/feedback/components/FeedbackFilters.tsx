import React, { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, Calendar } from "lucide-react";
import { FeedbackStatus } from "../types";
import { areaApi } from "@/features/area/api/areaApi";
import { binApi } from "@/features/bin/api/binApi";
import type { IArea } from "@/features/area/types";
import type { IBin } from "@/features/bin/types";

interface FeedbackFiltersProps {
  onSearch?: (search: string) => void;
  onStatusFilter?: (status: string) => void;
  onAreaFilter?: (areaId: string) => void;
  onBinFilter?: (binId: string) => void;
  onDateRangeFilter?: (startDate: string, endDate: string) => void;
  onClearFilters?: () => void;
  defaultStatus?: string;
  defaultSearch?: string;
  defaultAreaId?: string;
  defaultBinId?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  onSearch,
  onStatusFilter,
  onAreaFilter,
  onBinFilter,
  onDateRangeFilter,
  onClearFilters,
  defaultStatus = "",
  defaultSearch = "",
  defaultAreaId = "",
  defaultBinId = "",
  defaultStartDate = "",
  defaultEndDate = "",
}) => {
  // State quản lý giá trị input
  const [search, setSearch] = useState(defaultSearch);
  const [status, setStatus] = useState(defaultStatus);
  const [areaId, setAreaId] = useState(defaultAreaId);
  const [binId, setBinId] = useState(defaultBinId);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // State quản lý dữ liệu từ API
  const [areas, setAreas] = useState<IArea[]>([]);
  const [bins, setBins] = useState<IBin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dữ liệu danh mục (Khu vực & Thùng rác)
  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoading(true);
      try {
        const [areaRes, binRes] = await Promise.all([
          areaApi.getAll({ page: 1, limit: 100 }),
          binApi.getAll({ page: 1, limit: 100 })
        ]);
        setAreas(Array.isArray(areaRes.data) ? areaRes.data : []);
        setBins(Array.isArray(binRes.data) ? binRes.data : []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // Xử lý Xóa toàn bộ bộ lọc
  const handleClear = useCallback(() => {
    // 1. Reset state nội bộ
    setSearch("");
    setStatus("");
    setAreaId("");
    setBinId("");
    setStartDate("");
    setEndDate("");

    // 2. Báo cho component cha xóa các query params
    onSearch?.("");
    onStatusFilter?.("");
    onAreaFilter?.("");
    onBinFilter?.("");
    onDateRangeFilter?.("", "");
    onClearFilters?.();
  }, [onSearch, onStatusFilter, onAreaFilter, onBinFilter, onDateRangeFilter, onClearFilters]);

  // Theo dõi sự thay đổi của ngày tháng để trigger filter tự động
  useEffect(() => {
    onDateRangeFilter?.(startDate, endDate);
  }, [startDate, endDate]);

  const hasFilters = !!(search || status || areaId || binId || startDate || endDate);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        
        {/* Ô Tìm kiếm */}
        <div className="lg:col-span-2 xl:col-span-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tìm kiếm nội dung</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); onSearch?.(e.target.value); }}
              placeholder="Nhập nội dung phản ánh..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Lọc Trạng thái */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); onStatusFilter?.(e.target.value); }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value={FeedbackStatus.NEW}>Mới (Chưa xử lý)</option>
            <option value={FeedbackStatus.PROCESSING}>Đang xử lý</option>
            <option value={FeedbackStatus.RESOLVED}>Đã giải quyết</option>
          </select>
        </div>

        {/* Lọc Khu vực */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Khu vực</label>
          <select
            value={areaId}
            onChange={(e) => { setAreaId(e.target.value); onAreaFilter?.(e.target.value); }}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
          >
            <option value="">Tất cả khu vực</option>
            {areas.map((area) => (
              <option key={area._id || area.id} value={area._id || area.id}>{area.name}</option>
            ))}
          </select>
        </div>

        {/* Lọc Thùng rác */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Thùng rác</label>
          <select
            value={binId}
            onChange={(e) => { setBinId(e.target.value); onBinFilter?.(e.target.value); }}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
          >
            <option value="">Tất cả thùng rác</option>
            {bins.map((bin) => (
              <option key={bin._id || bin.id} value={bin._id || bin.id}>{bin.code}</option>
            ))}
          </select>
        </div>

        {/* Khoảng ngày */}
        <div className="lg:col-span-2 flex gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-end gap-2">
          {hasFilters && (
            <button
              onClick={handleClear}
              className="w-full py-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all font-bold text-xs uppercase"
            >
              <X size={14} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackFilters;