import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  ArrowUpDown,
  Truck, // Icon cho Xe tải/Ép rác
  Bike, // Icon cho Xe thu gom nhỏ
  Activity, // Icon cho Trạng thái
  CheckCircle2, // Available
  PlayCircle, // In Use
  AlertTriangle, // Maintenance
  WifiOff, // Offline
  Ban, // Full
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
import { VehicleFilterParams, VehicleType, VehicleStatus } from "../types";

interface VehicleFiltersProps {
  filters: VehicleFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<VehicleFilterParams>>;
  className?: string;
}

// --- CONFIG OPTIONS ---
const TYPE_OPTIONS = [
  {
    value: VehicleType.COMPACTOR,
    label: "Xe Ép Rác",
    icon: <Truck className="w-3.5 h-3.5" />,
    color: "text-orange-600 bg-orange-50",
  },
  {
    value: VehicleType.TRUCK,
    label: "Xe Tải Thùng",
    icon: <Truck className="w-3.5 h-3.5" />,
    color: "text-blue-600 bg-blue-50",
  },
  {
    value: VehicleType.COLLECTOR,
    label: "Xe Thu Gom Nhỏ",
    icon: <Bike className="w-3.5 h-3.5" />,
    color: "text-emerald-600 bg-emerald-50",
  },
] as const;

const STATUS_OPTIONS = [
  {
    value: VehicleStatus.AVAILABLE,
    label: "Sẵn sàng",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-emerald-600",
  },
  {
    value: VehicleStatus.IN_USE,
    label: "Đang làm việc",
    icon: <PlayCircle className="w-3.5 h-3.5" />,
    color: "text-blue-600",
  },
  {
    value: VehicleStatus.FULL,
    label: "Đã đầy rác",
    icon: <Ban className="w-3.5 h-3.5" />,
    color: "text-rose-600",
  },
  {
    value: VehicleStatus.MAINTENANCE,
    label: "Đang bảo trì",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-amber-600",
  },
  {
    value: VehicleStatus.OFFLINE,
    label: "Mất tín hiệu",
    icon: <WifiOff className="w-3.5 h-3.5" />,
    color: "text-slate-500",
  },
] as const;

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  setFilters,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. Debounce Search Logic (Tìm biển số) ---
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
    (key: keyof VehicleFilterParams, value: any) => {
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
      status: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      filters.search ||
      filters.type ||
      filters.status ||
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
              placeholder="Tìm biển số xe (VD: 59A-123.45)..."
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
            {/* Sort Dropdown (Optional - Disable for now) */}
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
            {/* 1. Type Filter (Loại xe) */}
            <Select
              value={filters.type || "all"}
              onValueChange={(val) =>
                handleChange("type", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Truck className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Loại xe:
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
                      <div className={cn("p-1 rounded-sm", opt.color)}>
                        {opt.icon}
                      </div>
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Status Filter (Trạng thái) */}
            <Select
              value={filters.status || "all"}
              onValueChange={(val) =>
                handleChange("status", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Activity className="w-3.5 h-3.5 text-foreground/70" />
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
                      <div className={cn("text-muted-foreground", opt.color)}>
                        {opt.icon}
                      </div>
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
