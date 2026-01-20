import React, { memo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Truck, // Icon xe tải/ép rác
  Bike, // Icon xe thu gom nhỏ
  Fuel, // Icon nhiên liệu
  Weight, // Icon tải trọng
  Copy,
  AlertCircle,
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
import { IVehicle, VehicleType, VehicleStatus } from "../types";

// ============================================================================
// 1. HELPER CONFIGS
// ============================================================================

// Cấu hình hiển thị cho Loại xe (Icon, Màu sắc)
const getVehicleTypeConfig = (type: VehicleType) => {
  switch (type) {
    case VehicleType.COMPACTOR:
      return {
        label: "Xe Ép Rác",
        icon: <Truck className="size-5" />,
        className: "bg-orange-100 text-orange-700 border-orange-200",
        iconContainer: "bg-orange-50 text-orange-600 border-orange-200",
      };
    case VehicleType.TRUCK:
      return {
        label: "Xe Tải Thùng",
        icon: <Truck className="size-5" />,
        className: "bg-blue-100 text-blue-700 border-blue-200",
        iconContainer: "bg-blue-50 text-blue-600 border-blue-200",
      };
    case VehicleType.COLLECTOR:
      return {
        label: "Xe Thu Gom",
        icon: <Bike className="size-5" />,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        iconContainer: "bg-emerald-50 text-emerald-600 border-emerald-200",
      };
    default:
      return {
        label: "Khác",
        icon: <AlertCircle className="size-5" />,
        className: "bg-gray-100 text-gray-600",
        iconContainer: "bg-gray-100",
      };
  }
};

// Cấu hình hiển thị cho Trạng thái
const getStatusConfig = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.AVAILABLE:
      return {
        label: "Sẵn sàng",
        className:
          "bg-emerald-500/15 text-emerald-700 border-emerald-200 hover:bg-emerald-500/25",
      };
    case VehicleStatus.IN_USE:
      return {
        label: "Đang làm việc",
        className:
          "bg-blue-500/15 text-blue-700 border-blue-200 hover:bg-blue-500/25",
      };
    case VehicleStatus.FULL:
      return {
        label: "Đã đầy",
        className:
          "bg-rose-500/15 text-rose-700 border-rose-200 hover:bg-rose-500/25",
      };
    case VehicleStatus.MAINTENANCE:
      return {
        label: "Bảo trì",
        className:
          "bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/25",
      };
    case VehicleStatus.OFFLINE:
      return {
        label: "Mất tín hiệu",
        className: "bg-slate-200 text-slate-600 border-slate-300",
      };
    default:
      return { label: "Không rõ", className: "bg-gray-100 text-gray-600" };
  }
};

// ============================================================================
// 2. VEHICLE TABLE ROW (COMPONENT CON)
// ============================================================================

interface VehicleTableRowProps {
  vehicle: IVehicle;
  onEdit: (vehicle: IVehicle) => void;
  onDelete: (vehicle: IVehicle) => void;
}

const VehicleTableRow = memo(
  ({ vehicle, onEdit, onDelete }: VehicleTableRowProps) => {
    const handleCopyPlate = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(vehicle.plateNumber);
      toast.success(`Đã sao chép biển số: ${vehicle.plateNumber}`);
    };

    const typeConfig = getVehicleTypeConfig(vehicle.type);
    const statusConfig = getStatusConfig(vehicle.status);

    // Tính phần trăm tải trọng
    const loadPercentage = Math.min(
      (vehicle.currentLoad / vehicle.capacity) * 100,
      100,
    );
    const getLoadColor = (percent: number) => {
      if (percent >= 90) return "bg-rose-500";
      if (percent >= 70) return "bg-amber-500";
      return "bg-emerald-500";
    };

    return (
      <TableRow className="group transition-colors border-b hover:bg-muted/40 cursor-pointer">
        {/* 1. Vehicle Info (Icon + Plate + Type) */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            {/* Icon Container */}
            <div
              className={cn(
                "relative size-10 rounded-lg border flex items-center justify-center shrink-0",
                typeConfig.iconContainer,
              )}
            >
              {typeConfig.icon}
            </div>

            <div className="min-w-0">
              <p className="font-bold text-foreground truncate flex items-center gap-2">
                {vehicle.plateNumber}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {typeConfig.label}
                </span>
              </div>
            </div>
          </div>
        </TableCell>

        {/* 2. Capacity & Load (Progress Bar) */}
        <TableCell>
          <div className="w-full max-w-[140px] space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Weight className="size-3" /> {vehicle.currentLoad}kg
              </span>
              <span>{vehicle.capacity}kg</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  getLoadColor(loadPercentage),
                )}
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
          </div>
        </TableCell>

        {/* 3. Fuel Level */}
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium py-1 px-2.5 rounded-full w-fit",
                    vehicle.fuelLevel <= 20
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-50 text-slate-700",
                  )}
                >
                  <Fuel className="size-3.5" />
                  <span>{vehicle.fuelLevel}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Mức nhiên liệu hiện tại</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>

        {/* 4. Status Badge */}
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "font-medium border px-2.5 py-0.5",
              statusConfig.className,
            )}
          >
            {statusConfig.label}
          </Badge>
        </TableCell>

        {/* 5. Actions */}
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
              <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                <Edit className="size-4 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyPlate}>
                <Copy className="size-4 mr-2" /> Copy Biển số
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete(vehicle)}
              >
                <Trash2 className="size-4 mr-2" /> Xóa bỏ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  },
);
VehicleTableRow.displayName = "VehicleTableRow";

// ============================================================================
// 3. MAIN TABLE COMPONENT
// ============================================================================

interface VehicleTableProps {
  data: IVehicle[];
  isLoading: boolean;
  onEdit: (vehicle: IVehicle) => void;
  onDelete: (vehicle: IVehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
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
            <TableHead className="w-[280px] text-xs font-bold uppercase text-muted-foreground pl-4">
              Phương tiện
            </TableHead>
            <TableHead className="w-[180px] text-xs font-bold uppercase text-muted-foreground">
              Tải trọng & Mức chứa
            </TableHead>
            <TableHead className="hidden sm:table-cell text-xs font-bold uppercase text-muted-foreground">
              Nhiên liệu
            </TableHead>
            <TableHead className="hidden md:table-cell w-[150px] text-xs font-bold uppercase text-muted-foreground">
              Trạng thái
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : data.length > 0 ? (
            data.map((vehicle) => (
              <VehicleTableRow
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <SmartWasteResult
                  status="empty"
                  title="Không tìm thấy phương tiện"
                  description="Thử thay đổi bộ lọc hoặc thêm phương tiện mới."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
