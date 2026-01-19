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
import FilterDropdown from "@/components/ui/FilterDropdown"; // Giữ nguyên component này nếu đã có
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BinFilterParams, BinStatus, BinType } from "@/features/bin/types";

// Types

// Import các selector (Nếu bạn chưa có, mình sẽ giả lập UI đơn giản trước)
// import { CollectionPointSelector } from "@/features/collection-points/components/CollectionPointSelector";

interface BinFiltersProps {
  filters: BinFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<BinFilterParams>>;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: BinStatus.ACTIVE, label: "Hoạt động", color: "bg-emerald-500" },
  { value: BinStatus.FULL, label: "Đầy", color: "bg-yellow-500" },
  { value: BinStatus.OVERLOAD, label: "Quá tải", color: "bg-red-500" },
  { value: BinStatus.BROKEN, label: "Hỏng", color: "bg-gray-500" },
  { value: BinStatus.MAINTENANCE, label: "Bảo trì", color: "bg-blue-500" },
] as const;

const TYPE_OPTIONS = [
  { value: BinType.ORGANIC, label: "Hữu cơ", icon: "🍏" },
  { value: BinType.INORGANIC, label: "Vô cơ", icon: "🧱" },
  { value: BinType.RECYCLE, label: "Tái chế", icon: "♻️" },
] as const;

export const BinFilters: React.FC<BinFiltersProps> = ({
  filters,
  setFilters,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. Debounce Search Logic ---
  const [localSearch, setLocalSearch] = useState(filters.keyword || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.keyword) {
        setFilters((prev) => ({ ...prev, search: localSearch, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters]);

  // Helper change params
  const handleChange = useCallback(
    (key: keyof BinFilterParams, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [setFilters],
  );

  // --- 2. Reset Logic ---
  const handleReset = () => {
    setLocalSearch("");
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: prev.limit,
      keyword: "",
      status: undefined,
      type: undefined,
      collectionPointId: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      filters.keyword ||
      filters.status ||
      filters.type ||
      // filters.collectionPointId ||
      (filters.page && filters.page > 1)
    );
  }, [filters]);

  return (
    <div
      className={cn(
        "w-full bg-card border border-border rounded-xl shadow-sm mb-6 transition-all hover:border-primary/20",
        className,
      )}
    >
      <div className="p-4 space-y-4">
        {/* --- TOP ROW: Search & Actions --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm theo Mã thùng (BIN-001) hoặc địa chỉ..."
              className="pl-9 bg-background h-10 text-sm border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium placeholder:font-normal"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-end">
            {/* Sort Dropdown (Optional - Nếu Backend hỗ trợ sort) */}
            <Select
              // value={filters.sort || "newest"}
              // onValueChange={(val) => handleChange("sort", val)}
              disabled // Tạm disable nếu chưa làm sort BE
            >
              <SelectTrigger className="w-[140px] h-10 text-sm bg-background border-input shadow-sm font-medium opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Mới nhất" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="capacity">Dung tích</SelectItem>
                <SelectItem value="level">Mức đầy</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border hidden md:block" />

            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 h-10 px-4 font-bold border-input shadow-sm transition-all",
                showFilters &&
                  "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
              )}
            >
              <Filter className="w-4 h-4" />
              Bộ lọc nâng cao
            </Button>

            {hasFilter && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-3 gap-2 font-bold animate-in zoom-in duration-200"
              >
                <RotateCcw className="size-4" />
                Xóa lọc
              </Button>
            )}
          </div>
        </div>

        {/* --- BOTTOM ROW: Expanded Filters --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            {/* 1. Status Filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={(val) =>
                handleChange("status", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <LayoutGrid className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Trạng thái:
                  </span>
                  <span className="text-foreground truncate font-semibold">
                    {filters.status
                      ? STATUS_OPTIONS.find((o) => o.value === filters.status)
                          ?.label
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2 font-medium">
                      <div
                        className={cn(
                          "size-2.5 rounded-full ring-1 ring-white/20",
                          opt.color,
                        )}
                      />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Bin Type Filter */}
            <Select
              value={filters.type || "all"}
              onValueChange={(val) =>
                handleChange("type", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Trash2 className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Loại rác:
                  </span>
                  <span className="text-foreground truncate font-semibold">
                    {filters.type
                      ? TYPE_OPTIONS.find((o) => o.value === filters.type)
                          ?.label
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các loại</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2 font-medium">
                      <span>{opt.icon}</span>
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 3. Collection Point Filter (Mock UI - Cần thay bằng Selector thật nếu có) */}
            <div
              className="relative opacity-60 cursor-not-allowed"
              title="Tính năng đang phát triển"
            >
              <div className="flex items-center w-full h-10 border border-input rounded-md px-3 shadow-sm bg-muted/50">
                <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Lọc theo điểm tập kết...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
