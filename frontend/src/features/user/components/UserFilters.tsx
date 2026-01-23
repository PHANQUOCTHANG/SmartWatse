import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  Shield,
  User,
  Users,
  Briefcase,
  ArrowUpDown, // Icon cho Sort
  MapPin, // Icon cho Area
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
import { MapAreaSelect } from "@/features/area/components/MapAreaSelect";

// Types
import { UserFilterParams, UserRole, UserStatus } from "../types";

interface UserFiltersProps {
  filters: UserFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<UserFilterParams>>;
  className?: string;
}

// --- CONFIG OPTIONS ---
const ROLE_OPTIONS = [
  {
    value: UserRole.ADMIN,
    label: "Quản trị viên",
    icon: <Shield className="size-3.5" />,
    color: "text-violet-600 bg-violet-50",
  },
  {
    value: UserRole.MANAGER,
    label: "Quản lý khu vực",
    icon: <Briefcase className="size-3.5" />,
    color: "text-blue-600 bg-blue-50",
  },
  {
    value: UserRole.STAFF,
    label: "Nhân viên",
    icon: <User className="size-3.5" />,
    color: "text-orange-600 bg-orange-50",
  },
  {
    value: UserRole.CITIZEN,
    label: "Cư dân",
    icon: <Users className="size-3.5" />,
    color: "text-emerald-600 bg-emerald-50",
  },
];

const STATUS_OPTIONS = [
  {
    value: UserStatus.ACTIVE,
    label: "Đang hoạt động",
    color: "bg-emerald-500",
  },
  { value: UserStatus.INACTIVE, label: "Đã bị khóa", color: "bg-slate-400" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Mới nhất" },
  { value: "createdAt", label: "Cũ nhất" },
  { value: "fullName", label: "Tên (A-Z)" },
  { value: "-fullName", label: "Tên (Z-A)" },
];

export const UserFilters: React.FC<UserFiltersProps> = ({
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
  const handleFilterChange = useCallback(
    (key: keyof UserFilterParams, value: string | undefined) => {
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
      search: "",
      sort: "-createdAt", // Reset về mặc định
      role: undefined,
      status: undefined,
      areaId: undefined, // Reset Area
    }));
  };

  const isFiltering = useMemo(() => {
    return !!(
      filters.search ||
      filters.role ||
      filters.status ||
      filters.areaId ||
      filters.sort !== "-createdAt"
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
        {/* --- TOP ROW: Search, Sort & Actions --- */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          {/* A. Search Bar */}
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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

          {/* B. Actions (Sort, Reset, Toggle) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {/* SORT SELECT */}
            <Select
              value={filters.sort || "-createdAt"}
              onValueChange={(val) => handleFilterChange("sort", val)}
            >
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
                  {(filters.role ? 1 : 0) +
                    (filters.status ? 1 : 0) +
                    (filters.areaId ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* --- BOTTOM ROW: Advanced Filters --- */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
            {/* 1. Filter Role */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1">
                Vai trò
              </label>
              <Select
                value={filters.role || "all"}
                onValueChange={(val) => handleFilterChange("role", val)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200">
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="font-medium text-slate-600"
                  >
                    Tất cả vai trò
                  </SelectItem>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1 rounded", opt.color)}>
                          {opt.icon}
                        </div>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Filter Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1">
                Trạng thái
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(val) => handleFilterChange("status", val)}
              >
                <SelectTrigger className="w-full h-10 bg-white border-slate-200">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="font-medium text-slate-600"
                  >
                    Tất cả trạng thái
                  </SelectItem>
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

            {/* 3. Filter Area (MapAreaSelect) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex items-center gap-1">
                <MapPin className="size-3" /> Khu vực
              </label>
              {/* MapAreaSelect: Component tự chọn khu vực và trả về ID */}
              <MapAreaSelect
                value={filters.areaId || ""}
                onChange={(val) => handleFilterChange("areaId", val)}
                placeholder="Lọc theo khu vực..."
                // className để đảm bảo height khớp với các input khác
                // Giả sử MapAreaSelect của bạn hỗ trợ className hoặc prop style
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
