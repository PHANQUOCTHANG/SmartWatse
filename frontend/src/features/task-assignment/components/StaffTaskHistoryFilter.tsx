import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Interface
export interface HistoryFilterParams {
  search: string;
  status: string; // "ALL" | "DONE" | "CANCELLED"
  date?: Date; // Dùng cho Date Picker đơn giản (hoặc thay bằng startDate/endDate nếu muốn range)
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

interface Props {
  filters: HistoryFilterParams;
  onChange: (newFilters: HistoryFilterParams) => void;
  onRefresh: () => void;
  className?: string;
}

// --- CONFIG OPTIONS ---
const STATUS_OPTIONS = [
  { value: "DONE", label: "Hoàn thành", color: "bg-emerald-500" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-500" },
];

export const StaffTaskHistoryFilter: React.FC<Props> = ({
  filters,
  onChange,
  onRefresh,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Local state cho search input để xử lý debounce
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // --- 1. Debounce Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 400); // Delay 400ms
    return () => clearTimeout(timer);
  }, [localSearch, onChange, filters]); // Lưu ý: Cần cẩn thận dependency để tránh loop

  // --- 2. Handlers ---
  const handleChange = useCallback(
    (key: keyof HistoryFilterParams, value: any) => {
      onChange({
        ...filters,
        [key]: value === "ALL" ? "ALL" : value, // Giữ logic "ALL"
        page: 1, // Luôn reset về trang 1 khi filter
      });
    },
    [onChange, filters],
  );

  const handleReset = () => {
    setLocalSearch("");
    onChange({
      search: "",
      status: "ALL",
      date: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
      limit: filters.limit,
    });
    onRefresh();
  };

  // Kiểm tra xem có đang filter không (để hiện nút Reset/Badge)
  const isFiltering = useMemo(() => {
    return !!(
      filters.search ||
      filters.status !== "ALL" ||
      filters.startDate ||
      filters.endDate ||
      filters.date
    );
  }, [filters]);

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200 rounded-xl shadow-sm mb-6 transition-all",
        className,
      )}
    >
      <div className="p-4 space-y-4">
        {/* --- TOP ROW --- */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          {/* SEARCH BAR */}
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm theo mã, tên nhiệm vụ..."
              className="pl-9 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all text-sm shadow-sm"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {/* RESET BUTTON */}
            {isFiltering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-10 px-3 gap-1.5 animate-in fade-in zoom-in duration-200"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline font-medium text-xs">
                  Đặt lại
                </span>
              </Button>
            )}

            {/* TOGGLE ADVANCED BUTTON */}
            <Button
              variant={showAdvanced ? "secondary" : "outline"}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "gap-2 h-10 px-4 font-semibold border-slate-200 shadow-sm transition-all",
                showAdvanced &&
                  "bg-indigo-50 text-indigo-600 border-indigo-200",
              )}
            >
              <Filter className="size-4" />
              Bộ lọc
              {isFiltering && !showAdvanced && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 min-w-[1.25rem] bg-indigo-100 text-indigo-700"
                >
                  {(filters.status !== "ALL" ? 1 : 0) +
                    (filters.startDate || filters.endDate ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* --- BOTTOM ROW: ADVANCED FILTERS --- */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
            {/* 1. Filter Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <LayoutGrid className="size-3" /> Trạng thái
              </label>
              <Select
                value={filters.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("size-2 rounded-full", opt.color)} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Filter Start Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <Calendar className="size-3" /> Từ ngày
              </label>
              <Input
                type="date"
                className="h-10 bg-white border-slate-200 block"
                value={filters.startDate ? filters.startDate.split("T")[0] : ""} // Xử lý ISO string nếu cần
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            {/* 3. Filter End Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <Calendar className="size-3" /> Đến ngày
              </label>
              <Input
                type="date"
                className="h-10 bg-white border-slate-200 block"
                value={filters.endDate ? filters.endDate.split("T")[0] : ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>

            {/* Placeholder cho cân đối layout */}
            <div className="hidden lg:block"></div>
          </div>
        )}
      </div>
    </div>
  );
};
