import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Filter,
  ArrowUpDown,
  Shield,
  Activity,
  UserCog,
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
import { UserFilterParams } from "../types";

interface UserFiltersProps {
  filters: UserFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<UserFilterParams>>;
  className?: string;
}

// --- CONFIG OPTIONS ---
const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Quản trị viên", color: "text-red-600 bg-red-50" },
  {
    value: "MANAGER",
    label: "Quản lý khu vực",
    color: "text-blue-600 bg-blue-50",
  },
  { value: "STAFF", label: "Nhân viên", color: "text-orange-600 bg-orange-50" },
  { value: "CITIZEN", label: "Người dân", color: "text-green-600 bg-green-50" },
  {
    value: "ORGANIZATION",
    label: "Tổ chức",
    color: "text-purple-600 bg-purple-50",
  },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động", color: "bg-emerald-500" },
  { value: "inactive", label: "Đã khóa / Chờ duyệt", color: "bg-gray-400" },
] as const;

export const UserFilters: React.FC<UserFiltersProps> = ({
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
  }, [localSearch, filters.keyword, setFilters]);

  // Helper change params
  const handleChange = useCallback(
    (key: keyof UserFilterParams, value: any) => {
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
      role: undefined,
      // status: undefined, // Nếu có filter status
    }));
  };

  // Check xem có đang filter không (để hiện nút Reset)
  const hasFilter = useMemo(() => {
    return !!(
      filters.keyword ||
      filters.role ||
      // filters.status ||
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
              placeholder="Tìm theo Tên, Email hoặc SĐT..."
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
            {/* 1. Role Filter */}
            <Select
              value={filters.role || "all"}
              onValueChange={(val) =>
                handleChange("role", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Shield className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Vai trò:
                  </span>
                  <span className="text-foreground truncate font-semibold">
                    {filters.role
                      ? ROLE_OPTIONS.find((o) => o.value === filters.role)
                          ?.label
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2 font-medium">
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                          opt.color,
                        )}
                      >
                        {opt.value.charAt(0)}
                      </span>
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Status Filter (Optional - Nếu API hỗ trợ filter status) */}
            <Select
              disabled // Tạm disable nếu chưa làm API filter status
              // value={filters.status || "all"}
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm opacity-50">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Activity className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Trạng thái:
                  </span>
                  <span className="text-foreground truncate font-semibold">
                    Tất cả
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
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

            {/* 3. Placeholder for future filter (e.g. Department / Area) */}
            <div
              className="relative opacity-60 cursor-not-allowed"
              title="Tính năng đang phát triển"
            >
              <div className="flex items-center w-full h-10 border border-input rounded-md px-3 shadow-sm bg-muted/50">
                <UserCog className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Lọc theo phòng ban...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
