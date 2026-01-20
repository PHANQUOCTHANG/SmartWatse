import React, { memo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Battery,
  Thermometer,
  Copy,
  Trash, // Icon thùng rác (Bin)
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        className:
          "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200",
      };
    case BinStatus.FULL:
      return {
        label: "Đầy",
        className:
          "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200",
      };
    case BinStatus.OVERLOAD:
      return {
        label: "Quá tải",
        className:
          "bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-200 animate-pulse",
      };
    case BinStatus.MAINTENANCE:
      return {
        label: "Bảo trì",
        className:
          "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200",
      };
    case BinStatus.BROKEN:
      return {
        label: "Hỏng",
        className:
          "bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 border-slate-200",
      };
    default:
      return { label: "Không rõ", className: "bg-gray-100 text-gray-600" };
  }
};

const getTypeConfig = (type: BinType) => {
  switch (type) {
    case BinType.ORGANIC:
      return { label: "Hữu cơ", color: "text-green-600 bg-green-50" };
    case BinType.INORGANIC:
      return { label: "Vô cơ", color: "text-orange-600 bg-orange-50" };
    case BinType.RECYCLE:
      return { label: "Tái chế", color: "text-blue-600 bg-blue-50" };
    default:
      return { label: "Khác", color: "text-gray-600" };
  }
};

// ============================================================================
// 2. BIN TABLE ROW (COMPONENT CON)
// ============================================================================

interface BinTableRowProps {
  bin: IBin;
  onEdit: (bin: IBin) => void;
  onDelete: (bin: IBin) => void;
}

const BinTableRow = memo(({ bin, onEdit, onDelete }: BinTableRowProps) => {
  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bin.code);
    toast.success(`Đã sao chép mã: ${bin.code}`);
  };

  const statusConfig = getStatusConfig(bin.status);
  const typeConfig = getTypeConfig(bin.binType);

  // Tính toán màu thanh progress bar
  const getProgressColor = (level: number) => {
    if (level >= 90) return "bg-rose-500";
    if (level >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <TableRow className="group transition-colors border-b hover:bg-muted/40 cursor-pointer">
      {/* 1. Checkbox (Optional - Nếu muốn chọn nhiều) */}
      {/* <TableCell className="w-10 text-center"><Checkbox /></TableCell> */}

      {/* 2. Bin Info (Image + Code) */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {/* Avatar / Image */}
          <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-slate-100 flex items-center justify-center shrink-0">
            {bin.coverImage ? (
              <img
                src={bin.coverImage}
                alt={bin.code}
                className="size-full object-cover"
              />
            ) : (
              <Trash className="size-6 text-slate-400" />
            )}
          </div>

          {/* Code & Brand */}
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate flex items-center gap-2">
              {bin.code}
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1 py-0 h-5 font-normal",
                  typeConfig.color,
                )}
              >
                {typeConfig.label}
              </Badge>
            </p>
            <p
              className="text-xs text-muted-foreground truncate max-w-[150px]"
              title={bin.brand}
            >
              {bin.brand || "Chưa cập nhật hãng"}
            </p>
          </div>
        </div>
      </TableCell>

      {/* 3. Location */}
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-start gap-2 max-w-[200px]">
          <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <span
            className="text-sm text-muted-foreground truncate"
            title={bin.address}
          >
            {bin.address || "Chưa có địa chỉ"}
          </span>
        </div>
      </TableCell>

      {/* 4. Capacity & Level */}
      <TableCell>
        <div className="w-full max-w-[120px] space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>{bin.currentLevel}%</span>
            <span>{bin.capacity}L</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={cn(
                "h-full transition-all duration-500",
                getProgressColor(bin.currentLevel),
              )}
              style={{ width: `${bin.currentLevel}%` }}
            />
          </div>
        </div>
      </TableCell>

      {/* 5. IoT Status (Battery, Temp) */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-3">
          {/* Pin */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    bin.battery && bin.battery < 20
                      ? "text-rose-500"
                      : "text-slate-600",
                  )}
                >
                  <Battery className="size-3.5" />
                  <span>{bin.battery ?? "--"}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Pin cảm biến</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Nhiệt độ */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    bin.temperature && bin.temperature > 50
                      ? "text-rose-500"
                      : "text-slate-600",
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

      {/* 6. Status Badge */}
      <TableCell>
        <Badge
          variant="outline"
          className={cn("font-medium border", statusConfig.className)}
        >
          {statusConfig.label}
        </Badge>
      </TableCell>

      {/* 7. Actions */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-slate-100"
            >
              <MoreHorizontal className="size-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(bin)}>
              <Edit className="size-4 mr-2" /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyCode}>
              <Copy className="size-4 mr-2" /> Copy Mã thùng
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => onDelete(bin)}
            >
              <Trash2 className="size-4 mr-2" /> Xóa bỏ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
BinTableRow.displayName = "BinTableRow";

// ============================================================================
// 3. MAIN TABLE COMPONENT
// ============================================================================

interface BinTableProps {
  data: IBin[];
  isLoading: boolean;
  onEdit: (bin: IBin) => void;
  onDelete: (bin: IBin) => void;
}

export const BinTable: React.FC<BinTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[250px] text-xs font-bold uppercase text-muted-foreground">
              Thông tin thùng
            </TableHead>
            <TableHead className="hidden sm:table-cell text-xs font-bold uppercase text-muted-foreground">
              Vị trí
            </TableHead>
            <TableHead className="w-[150px] text-xs font-bold uppercase text-muted-foreground">
              Mức chứa
            </TableHead>
            <TableHead className="hidden md:table-cell w-[120px] text-xs font-bold uppercase text-muted-foreground">
              IoT
            </TableHead>
            <TableHead className="w-[120px] text-xs font-bold uppercase text-muted-foreground">
              Trạng thái
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : data.length > 0 ? (
            data.map((bin) => (
              <BinTableRow
                key={bin._id}
                bin={bin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <SmartWasteResult
                  status="empty"
                  title="Không tìm thấy thùng rác"
                  description="Thử điều chỉnh bộ lọc hoặc thêm thùng rác mới."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
