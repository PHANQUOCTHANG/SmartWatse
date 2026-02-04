import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Calendar,
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

// Types
import { TaskFilterParams, TaskStatus } from "../types";

interface CollectionTaskFiltersProps {
  filters: TaskFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterParams>>;
  className?: string;
}

// --- CONFIG OPTIONS ---
const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: "Chờ xử lý", color: "bg-gray-500" },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "Đang thực hiện",
    color: "bg-blue-500",
  },
  { value: TaskStatus.DONE, label: "Hoàn thành", color: "bg-emerald-500" },
];

const SORT_OPTIONS = [
  { value: "-scheduledDate", label: "Mới nhất" },
  { value: "scheduledDate", label: "Cũ nhất" },
];

export const CollectionTaskFilters: React.FC<CollectionTaskFiltersProps> = ({
  filters,
  setFilters,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.keyword || "");

  // --- 1. Debounce Search (Map localSearch -> keyword) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.keyword) {
        setFilters((prev) => ({ ...prev, keyword: localSearch, page: 1 }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters, filters.keyword]);

  // --- 2. Handlers ---
  const handleChange = useCallback(
    (key: keyof TaskFilterParams, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
        page: 1,
      }));
    },
    [setFilters],
  );

  const handleReset = () => {
    setLocalSearch("");
    setFilters((prev) => ({
      page: 1,
      limit: prev.limit,
      keyword: "",
      status: undefined,
      scheduleId: undefined,
      binId: undefined,
      areaId: undefined,
      startDate: undefined,
      endDate: undefined,
    }));
  };

  const isFiltering = useMemo(() => {
    return !!(
      filters.keyword ||
      filters.status ||
      filters.startDate ||
      filters.endDate
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm theo nội dung..."
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
            {/* SORT (Mock UI - Backend xử lý sort default) */}
            <Select defaultValue="-scheduledDate">
              <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="size-3.5 text-slate-400" />
                  <SelectValue placeholder="Sắp xếp" />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

            {/* RESET */}
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

            {/* TOGGLE ADVANCED */}
            <Button
              variant={showAdvanced ? "secondary" : "outline"}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "gap-2 h-10 px-4 font-semibold border-slate-200 shadow-sm transition-all",
                showAdvanced && "bg-blue-50 text-blue-600 border-blue-200",
              )}
            >
              <Filter className="size-4" />
              Bộ lọc
              {isFiltering && !showAdvanced && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 min-w-[1.25rem] bg-blue-100 text-blue-700"
                >
                  {(filters.status ? 1 : 0) +
                    (filters.startDate || filters.endDate ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* --- BOTTOM ROW: ADVANCED --- */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
            {/* 1. Filter Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <LayoutGrid className="size-3" /> Trạng thái
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
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
                value={filters.startDate || ""}
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
                value={filters.endDate || ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>

            {/* Placeholder cho cột thứ 4 nếu muốn layout cân đối (hoặc để trống) */}
            <div className="hidden lg:block"></div>
          </div>
        )}
      </div>
    </div>
  );
};
