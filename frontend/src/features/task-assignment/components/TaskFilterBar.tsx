import { useState } from "react";
import { useTaskAreas } from "../hooks/useTaskAreas";

interface TaskFilterBarProps {
  filters?: {
    areaId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
  onFilterChange?: (key: string, value: string) => void;
  onResetFilters?: () => void;
}

const TaskFilterBar = ({
  filters = {},
  onFilterChange,
  onResetFilters,
}: TaskFilterBarProps) => {
  const { areas, isLoading } = useTaskAreas();
  const [startDate, setStartDate] = useState(filters.startDate || "");
  const [endDate, setEndDate] = useState(filters.endDate || "");
  const [selectedArea, setSelectedArea] = useState(filters.areaId || "");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "");

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedArea(value);
    onFilterChange?.("areaId", value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onFilterChange?.("status", value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    onFilterChange?.("startDate", value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    onFilterChange?.("endDate", value);
  };

  const handleResetFilters = () => {
    setSelectedArea("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    onResetFilters?.();
  };

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters =
    selectedArea || selectedStatus || startDate || endDate;

  return (
    <div className="flex items-center justify-between mb-1">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Danh sách nhiệm vụ chờ xử lý
      </h2>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Area filter */}
        <select
          value={selectedArea}
          onChange={handleAreaChange}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <option value="">Tất cả khu vực</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="IN_PROGRESS">Đang thực hiện</option>
          <option value="DONE">Hoàn thành</option>
        </select>

        {/* Start Date filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50"
          />
        </div>

        {/* End Date filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50"
          />
        </div>

        {/* Advanced filter icon */}
        <button
          className="w-10 h-10 border rounded-lg bg-white flex items-center justify-center hover:bg-gray-50"
          title="Bộ lọc nâng cao"
        >
          <span className="text-gray-600 text-lg">≡</span>
        </button>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 flex items-center gap-1"
            title="Xóa tất cả bộ lọc"
          >
            ✕ Xóa lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilterBar;
