import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  ArrowUpDown,
  Building2, // Icon cho Quận
  Map, // Icon cho Phường
  MapPin,
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

// Types
import { AreaFilterParams, AreaType } from "../types";

// Props bổ sung: parentOptions để hiển thị dropdown chọn Quận
interface AreaFiltersProps {
  filters: AreaFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<AreaFilterParams>>;
  // Danh sách các Quận để lọc (dùng cho filter Parent)
  parentOptions?: { label: string; value: string }[];
  className?: string;
}

const TYPE_OPTIONS = [
  {
    value: AreaType.DISTRICT,
    label: "Quận / Huyện",
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: "text-blue-600 bg-blue-50",
  },
  {
    value: AreaType.WARD,
    label: "Phường / Xã",
    icon: <Map className="w-3.5 h-3.5" />,
    color: "text-green-600 bg-green-50",
  },
] as const;

export const AreaFilters: React.FC<AreaFiltersProps> = ({
  filters,
  setFilters,
  parentOptions = [],
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. Debounce Search Logic ---
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters((prev) => ({ ...prev, search: localSearch, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters]);

  // Helper change params
  const handleChange = useCallback(
    (key: keyof AreaFilterParams, value: any) => {
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
      search: "",
      type: undefined,
      parentId: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      filters.search ||
      filters.type ||
      filters.parentId ||
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
              placeholder="Tìm kiếm tên khu vực..."
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
            {/* Sort Dropdown (Optional) */}
            <Select disabled>
              <SelectTrigger className="w-[140px] h-10 text-sm bg-background border-input shadow-sm font-medium opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Mới nhất" />
                </div>
              </SelectTrigger>
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
              Bộ lọc
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
            {/* 1. Type Filter (Cấp hành chính) */}
            <Select
              value={filters.type || "all"}
              onValueChange={(val) =>
                handleChange("type", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <MapPin className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Cấp:
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
                <SelectItem value="all">Tất cả cấp</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2 font-medium">
                      <div className={cn("p-1 rounded-sm", opt.color)}>
                        {opt.icon}
                      </div>
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Parent Filter (Lọc theo Quận/Huyện) */}
            <Select
              value={filters.parentId || "all"}
              onValueChange={(val) =>
                handleChange("parentId", val === "all" ? undefined : val)
              }
              // Chỉ enable khi filter type là WARD hoặc user không filter type (để tìm con)
              // Hoặc cứ để enable cho linh hoạt
            >
              <SelectTrigger
                className={cn(
                  "w-full h-10 bg-background border-input shadow-sm",
                  parentOptions.length === 0 && "opacity-60 cursor-not-allowed",
                )}
              >
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Building2 className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Thuộc Quận:
                  </span>
                  <span className="text-foreground truncate font-semibold max-w-[150px]">
                    {filters.parentId
                      ? parentOptions.find((o) => o.value === filters.parentId)
                          ?.label || "..."
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Quận/Huyện</SelectItem>
                {parentOptions.length > 0 ? (
                  parentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-center text-muted-foreground">
                    Đang tải danh sách...
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
