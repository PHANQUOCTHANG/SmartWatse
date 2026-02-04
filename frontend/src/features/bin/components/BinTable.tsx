import React, { memo, useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Battery,
  Thermometer,
  Copy,
  Trash,
  ArrowUpDown,
  Zap,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // Checkbox
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TableSkeleton from "@/components/ui/TableSkeleton";
import SmartWasteResult from "@/components/ui/Result";

// Utilities & Types
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IBin, BinStatus, BinType } from "../types";

// ============================================================================
// 1. HELPER CONFIGS
// ============================================================================

const getStatusConfig = (status: BinStatus) => {
  switch (status) {
    case BinStatus.ACTIVE:
      return {
        label: "Hoạt động",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    case BinStatus.FULL:
      return {
        label: "Đầy rác",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    case BinStatus.OVERFLOW:
      return {
        label: "Quá tải",
        className: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
        dot: "bg-rose-500",
      };
    case BinStatus.MAINTENANCE:
      return {
        label: "Bảo trì",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    case BinStatus.BROKEN:
      return {
        label: "Hỏng hóc",
        className: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-500",
      };
    default:
      return {
        label: "Không rõ",
        className: "bg-gray-50 text-gray-600",
        dot: "bg-gray-400",
      };
  }
};

const getTypeConfig = (type: BinType) => {
  switch (type) {
    case BinType.ORGANIC:
      return {
        label: "Hữu cơ",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: "🍏",
      };
    case BinType.INORGANIC:
      return {
        label: "Vô cơ",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        icon: "🧱",
      };
    case BinType.RECYCLE:
      return {
        label: "Tái chế",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: "♻️",
      };
    default:
      return { label: "Khác", color: "text-gray-600 bg-gray-50", icon: "❓" };
  }
};

const getLevelColor = (level: number) => {
  if (level >= 90) return "bg-rose-500 shadow-rose-200";
  if (level >= 75) return "bg-amber-500 shadow-amber-200";
  return "bg-emerald-500 shadow-emerald-200";
};

// ============================================================================
// 2. BIN ROW (OPTIMIZED)
// ============================================================================

interface BinTableRowProps {
  bin: IBin;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: (bin: IBin) => void;
  onDelete: (bin: IBin) => void;
}

const BinTableRow = memo(
  ({ bin, isSelected, onSelect, onEdit, onDelete }: BinTableRowProps) => {
    const handleCopy = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}: ${text}`);
    };

    const statusInfo = getStatusConfig(bin.status);
    const typeInfo = getTypeConfig(bin.binType);

    return (
      <TableRow
        className={cn(
          "group transition-all hover:bg-slate-50/50 border-b border-slate-100",
          isSelected && "bg-blue-50/60 hover:bg-blue-50/80",
        )}
      >
        {/* CHECKBOX */}
        <TableCell className="w-[40px] pl-4">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>

        {/* 1. INFO (Image + Code + Brand) */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className="relative size-12 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm shrink-0 flex items-center justify-center">
              {bin.coverImage ? (
                <img
                  src={bin.coverImage}
                  alt={bin.code}
                  className="size-full object-cover"
                />
              ) : (
                <Trash className="size-5 text-slate-300" />
              )}
            </div>

            <div className="flex flex-col gap-0.5 max-w-[180px]">
              <div
                className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleCopy(bin.code, "Mã thùng")}
              >
                {bin.code}
                <Copy className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-5 font-medium border shadow-none",
                    typeInfo.color,
                  )}
                >
                  <span className="mr-1">{typeInfo.icon}</span> {typeInfo.label}
                </Badge>
                <span className="text-[10px] text-slate-400 px-1 border-l border-slate-200">
                  {bin.capacity}L
                </span>
              </div>
            </div>
          </div>
        </TableCell>

        {/* 2. LOCATION */}
        <TableCell className="hidden sm:table-cell">
          <div className="flex flex-col gap-1 max-w-[200px]">
            <div className="flex items-start gap-1.5">
              <MapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span
                className="text-xs text-slate-600 truncate font-medium"
                title={bin.address}
              >
                {bin.address || "Chưa cập nhật địa chỉ"}
              </span>
            </div>
            <span
              className="text-[10px] text-slate-400 font-mono ml-5 cursor-pointer hover:text-blue-500"
              onClick={() =>
                handleCopy(`${bin.latitude}, ${bin.longitude}`, "Tọa độ")
              }
            >
              {bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}
            </span>
          </div>
        </TableCell>

        {/* 3. LEVEL (Progress Bar) */}
        <TableCell>
          <div className="w-full max-w-[140px] space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-700">Mức chứa</span>
              <span
                className={cn(
                  "font-bold",
                  bin.currentLevel > 90 ? "text-rose-600" : "text-slate-500",
                )}
              >
                {bin.currentLevel}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
              <div
                className={cn(
                  "h-full transition-all duration-700 ease-out shadow-sm",
                  getLevelColor(bin.currentLevel),
                )}
                style={{ width: `${bin.currentLevel}%` }}
              />
            </div>
          </div>
        </TableCell>

        {/* 4. IOT STATS */}
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      (bin.battery || 0) < 20
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-white text-slate-600 border-slate-200",
                    )}
                  >
                    <Battery
                      className={cn(
                        "size-3.5",
                        (bin.battery || 0) > 80 && "fill-current",
                      )}
                    />
                    <span>{bin.battery ?? "--"}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Pin thiết bị</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border",
                      (bin.temperature || 0) > 50
                        ? "bg-orange-50 text-orange-600 border-orange-200"
                        : "bg-white text-slate-600 border-slate-200",
                    )}
                  >
                    <Thermometer className="size-3.5" />
                    <span>{bin.temperature ?? "--"}°C</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nhiệt độ thùng</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>

        {/* 5. STATUS */}
        <TableCell>
          <div
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-sm",
              statusInfo.className,
            )}
          >
            <span
              className={cn("size-1.5 rounded-full mr-2", statusInfo.dot)}
            />
            {statusInfo.label}
          </div>
        </TableCell>

        {/* 6. ACTIONS */}
        <TableCell className="text-right pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-slate-100 shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => onEdit(bin)}
                className="cursor-pointer"
              >
                <Edit className="size-4 mr-2 text-slate-500" /> Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleCopy(bin.code, "Mã thùng")}
                className="cursor-pointer"
              >
                <Copy className="size-4 mr-2 text-slate-500" /> Copy Mã ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {}}
                className="cursor-pointer text-orange-600 focus:text-orange-700 focus:bg-orange-50"
              >
                <Zap className="size-4 mr-2" /> Reset cảm biến
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(bin)}
                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <Trash2 className="size-4 mr-2" /> Xóa thiết bị
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  },
);
BinTableRow.displayName = "BinTableRow";

// ============================================================================
// 3. MAIN TABLE
// ============================================================================

interface BinTableProps {
  data: IBin[];
  isLoading: boolean;
  onEdit: (bin: IBin) => void;
  onDelete: (bin: IBin) => void;
  // Sort Props (Optional)
  onSort?: (field: string) => void;
}

export const BinTable: React.FC<BinTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSort,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(data.map((b) => b.id)));
    else setSelectedIds(new Set());
  };

  // Handle Single Select
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  // Helper Header
  const SortableHead = ({
    label,
    sortKey,
    className,
  }: {
    label: string;
    sortKey?: string;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "h-11 text-xs font-bold uppercase text-slate-500 select-none",
        className,
        sortKey && "cursor-pointer hover:bg-slate-50 hover:text-slate-700",
      )}
      onClick={() => sortKey && onSort?.(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {sortKey && <ArrowUpDown className="size-3 opacity-40" />}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* BULK ACTIONS (Hiện khi chọn) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50/80 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-blue-700">
            Đã chọn <b>{selectedIds.size}</b> thiết bị
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-blue-200 text-blue-700 hover:bg-blue-100 bg-white"
            >
              Bảo trì hàng loạt
            </Button>
            <Button size="sm" variant="destructive" className="h-8">
              Xóa {selectedIds.size} mục
            </Button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] pl-4">
                <Checkbox
                  checked={data.length > 0 && selectedIds.size === data.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <SortableHead
                label="Thiết bị & Loại"
                sortKey="code"
                className="w-[280px]"
              />
              <TableHead className="hidden sm:table-cell text-xs font-bold uppercase text-slate-500">
                Vị trí
              </TableHead>
              <SortableHead
                label="Mức chứa"
                sortKey="currentLevel"
                className="w-[160px]"
              />
              <TableHead className="hidden md:table-cell text-xs font-bold uppercase text-slate-500">
                IoT Status
              </TableHead>
              <SortableHead
                label="Trạng thái"
                sortKey="status"
                className="w-[140px]"
              />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={7} />
            ) : data.length > 0 ? (
              data.map((bin) => (
                <BinTableRow
                  key={bin.id}
                  bin={bin}
                  isSelected={selectedIds.has(bin.id)}
                  onSelect={(c) => handleSelectRow(bin.id, c)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-72 text-center">
                  <SmartWasteResult
                    status="empty"
                    title="Không tìm thấy thùng rác"
                    description="Thử điều chỉnh bộ lọc hoặc thêm thiết bị mới."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
