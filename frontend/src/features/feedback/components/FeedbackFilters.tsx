import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { FeedbackStatus } from "../types";
import { useFeedbackMetadata } from "../hooks/useFeedbackMetadata";

interface FeedbackFiltersProps {
  onSearch?: (search: string) => void;
  onStatusFilter?: (status: string) => void;
  onAreaFilter?: (areaId: string) => void;
  onBinFilter?: (binId: string) => void;
  onCollectionPointFilter?: (collectionPointId: string) => void;
  onDateRangeFilter?: (startDate: string, endDate: string) => void;
  onClearFilters?: () => void;
  defaultStatus?: string;
  defaultSearch?: string;
  defaultAreaId?: string;
  defaultBinId?: string;
  defaultCollectionPointId?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  onSearch,
  onStatusFilter,
  onAreaFilter,
  onBinFilter,
  onCollectionPointFilter,
  onDateRangeFilter,
  onClearFilters,
  defaultStatus = "",
  defaultSearch = "",
  defaultAreaId = "",
  defaultBinId = "",
  defaultCollectionPointId = "",
  defaultStartDate = "",
  defaultEndDate = "",
}) => {
  // State quản lý giá trị input
  const [search, setSearch] = useState(defaultSearch);
  const [status, setStatus] = useState(defaultStatus);
  const [areaId, setAreaId] = useState(defaultAreaId);
  const [collectionPointId, setCollectionPointId] = useState(
    defaultCollectionPointId,
  );
  const [binId, setBinId] = useState(defaultBinId);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // State quản lý dữ liệu từ API
  const {
    areas,
    collectionPoints,
    bins,
    isLoading,
    fetchCollectionPoints,
    fetchBins,
  } = useFeedbackMetadata();

  // Handle area selection - fetch collection points
  const handleAreaChange = (newAreaId: string) => {
    setAreaId(newAreaId);
    setCollectionPointId(""); // Reset collection point
    setBinId(""); // Reset bin
    onAreaFilter?.(newAreaId);
    if (newAreaId) {
      fetchCollectionPoints(newAreaId);
    }
  };

  // Handle collection point selection - fetch bins
  const handleCollectionPointChange = (newCollectionPointId: string) => {
    setCollectionPointId(newCollectionPointId);
    setBinId(""); // Reset bin
    onCollectionPointFilter?.(newCollectionPointId);
    if (newCollectionPointId) {
      fetchBins(newCollectionPointId);
    }
  };

  // Xử lý thay đổi bin
  const handleBinChange = (newBinId: string) => {
    setBinId(newBinId);
    onBinFilter?.(newBinId);
  };

  // Xử lý Xóa toàn bộ bộ lọc
  const handleClear = useCallback(() => {
    setSearch("");
    setStatus("");
    setAreaId("");
    setBinId("");
    setCollectionPointId("");
    setStartDate("");
    setEndDate("");

    onSearch?.("");
    onStatusFilter?.("");
    onAreaFilter?.("");
    onBinFilter?.("");
    onCollectionPointFilter?.("");
    onDateRangeFilter?.("", "");
    onClearFilters?.();
  }, [
    onSearch,
    onStatusFilter,
    onAreaFilter,
    onBinFilter,
    onCollectionPointFilter,
    onDateRangeFilter,
    onClearFilters,
  ]);

  const hasFilters = !!(
    search ||
    status ||
    areaId ||
    binId ||
    collectionPointId ||
    startDate ||
    endDate
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {/* Ô Tìm kiếm */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Nhập nội dung..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Lọc Trạng thái */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              onStatusFilter?.(e.target.value);
            }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer transition-all"
          >
            <option value="">Tất cả</option>
            <option value={FeedbackStatus.NEW}>Mới</option>
            <option value={FeedbackStatus.PROCESSING}>Đang xử lý</option>
            <option value={FeedbackStatus.RESOLVED}>Đã xử lý</option>
          </select>
        </div>

        {/* Lọc Khu vực */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Khu vực
          </label>
          <select
            value={areaId}
            onChange={(e) => handleAreaChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">Tất cả</option>
            {areas.map((area) => (
              <option key={area._id || area.id} value={area._id || area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Điểm thom gom */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Điểm thu gom
          </label>
          <select
            value={collectionPointId}
            onChange={(e) => handleCollectionPointChange(e.target.value)}
            disabled={!areaId || isLoading}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">Tất cả</option>
            {collectionPoints.map((point) => (
              <option key={point._id || point.id} value={point._id || point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc Thùng rác */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Thùng rác
          </label>
          <select
            value={binId}
            onChange={(e) => handleBinChange(e.target.value)}
            disabled={!collectionPointId || isLoading}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="">Tất cả</option>
            {bins.map((bin) => (
              <option key={bin._id || bin.id} value={bin._id || bin.id}>
                {bin.code}
              </option>
            ))}
          </select>
        </div>

        {/* Từ ngày */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              onDateRangeFilter?.(e.target.value, endDate);
            }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Đến ngày */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              onDateRangeFilter?.(startDate, e.target.value);
            }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Nút hành động */}
        <div className="flex items-end">
          {hasFilters && (
            <button
              onClick={handleClear}
              className="w-full py-2.5 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all font-bold text-xs uppercase"
            >
              <X size={14} />
              Xóa lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackFilters;
