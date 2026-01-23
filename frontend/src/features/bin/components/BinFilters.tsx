import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  MapPin,
  Trash2,
  Filter,
  ArrowUpDown,
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

// Custom Components
import { MapCollectionPointSelect } from "@/features/collection-points/components/MapCollectionPointSelect";

// Types
import { BinFilterParams, BinStatus, BinType } from "@/features/bin/types";

interface BinFiltersProps {
  filters: BinFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<BinFilterParams>>;
  className?: string;
}

// --- CONFIG ---
const STATUS_OPTIONS = [
  { value: BinStatus.ACTIVE, label: "Hoạt động", color: "bg-emerald-500" },
  { value: BinStatus.FULL, label: "Đầy", color: "bg-yellow-500" },
  { value: BinStatus.OVERFLOW, label: "Quá tải", color: "bg-red-500" },
  { value: BinStatus.BROKEN, label: "Hỏng", color: "bg-gray-500" },
  { value: BinStatus.MAINTENANCE, label: "Bảo trì", color: "bg-blue-500" },
];

const TYPE_OPTIONS = [
  { value: BinType.ORGANIC, label: "Hữu cơ", icon: "🍏" },
  { value: BinType.INORGANIC, label: "Vô cơ", icon: "🧱" },
  { value: BinType.RECYCLE, label: "Tái chế", icon: "♻️" },
];
const SORT_OPTIONS = [
  { value: "name", label: "Tên (A-Z)" },
  { value: "-name", label: "Tên (Z-A)" },
  { value: "-createdAt", label: "Mới nhất" },
  { value: "createdAt", label: "Cũ nhất" },
];

export const BinFilters: React.FC<BinFiltersProps> = ({
  filters,
  setFilters,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // --- 1. Debounce Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters((prev) => ({ ...prev, search: localSearch, page: 1 }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters, filters.search]);

  // --- 2. Handlers ---
  const handleChange = useCallback(
    (key: keyof BinFilterParams, value: any) => {
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
      type: undefined,
      collectionPointId: undefined, // Reset điểm tập kết
    }));
  };

  const isFiltering = useMemo(() => {
    return !!(
      filters.search ||
      filters.status ||
      filters.binType ||
      filters.collectionPointId
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
              placeholder="Tìm theo Mã thùng hoặc Vị trí..."
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
            {/* SORT (Mock UI) */}
            <Select
              value={filters.sort || "name"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[150px] h-10 border-slate-200 bg-white font-medium text-slate-700">
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

            {/* TOGGLE */}
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
                    (filters.binType ? 1 : 0) +
                    (filters.collectionPointId ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* --- BOTTOM ROW: ADVANCED --- */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
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

            {/* 2. Filter Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <Trash2 className="size-3" /> Loại rác
              </label>
              <Select
                value={filters.binType || "all"}
                onValueChange={(val) => handleChange("binType", val)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Filter Collection Point (MapCollectionPointSelect) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <MapPin className="size-3" /> Điểm tập kết
              </label>
              <MapCollectionPointSelect
                value={filters.collectionPointId || ""}
                onChange={(val) => handleChange("collectionPointId", val)}
                placeholder="Lọc theo điểm tập kết..."
                // className để đồng bộ style
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
