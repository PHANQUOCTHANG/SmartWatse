import React, { memo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Building2, // Icon cho Quận
  Map, // Icon cho Phường
  Calendar,
  Copy,
  ArrowUpRight, // Icon chỉ cấp cha
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
import TableSkeleton from "@/components/ui/TableSkeleton";
import SmartWasteResult from "@/components/ui/Result";

// Utilities & Types
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IArea, AreaType } from "../types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// ============================================================================
// 1. HELPER CONFIGS
// ============================================================================

const getAreaTypeConfig = (type: AreaType) => {
  switch (type) {
    case AreaType.DISTRICT:
      return {
        label: "Quận / Huyện",
        icon: <Building2 className="size-3.5 mr-1" />,
        className:
          "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
        iconColor: "text-blue-500 bg-blue-50",
      };
    case AreaType.WARD:
      return {
        label: "Phường / Xã",
        icon: <Map className="size-3.5 mr-1" />,
        className:
          "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
        iconColor: "text-green-500 bg-green-50",
      };
    default:
      return {
        label: "Khác",
        icon: null,
        className: "bg-gray-100 text-gray-600",
        iconColor: "bg-gray-100",
      };
  }
};

// ============================================================================
// 2. AREA TABLE ROW (COMPONENT CON)
// ============================================================================

interface AreaTableRowProps {
  area: IArea;
  onEdit: (area: IArea) => void;
  onDelete: (area: IArea) => void;
}

const AreaTableRow = memo(({ area, onEdit, onDelete }: AreaTableRowProps) => {
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(area.id);
    toast.success("Đã sao chép ID khu vực");
  };

  const typeConfig = getAreaTypeConfig(area.type);

  // Xử lý hiển thị tên cha
  // parentId có thể là null (nếu là Quận) hoặc Object {id, name} (nếu là Phường đã populate)
  const parentName =
    area.parentId &&
    typeof area.parentId === "object" &&
    "name" in area.parentId
      ? area.parentId.name
      : null;

  return (
    <TableRow className="group transition-colors border-b hover:bg-muted/40 cursor-pointer">
      {/* 1. Area Info (Icon + Name) */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {/* Icon Placeholder */}
          <div
            className={cn(
              "relative size-10 rounded-lg border border-border flex items-center justify-center shrink-0",
              typeConfig.iconColor,
            )}
          >
            {area.type === AreaType.DISTRICT ? (
              <Building2 className="size-5" />
            ) : (
              <Map className="size-5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-foreground truncate flex items-center gap-2">
              {area.name}
            </p>
            <p
              className="text-xs text-muted-foreground font-mono truncate"
              title={area.id}
            >
              ID: {area.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </TableCell>

      {/* 2. Type Badge */}
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "font-medium border pl-2 pr-3 py-0.5",
            typeConfig.className,
          )}
        >
          {typeConfig.icon}
          {typeConfig.label}
        </Badge>
      </TableCell>

      {/* 3. Parent Info (Trực thuộc) */}
      <TableCell className="hidden sm:table-cell">
        {parentName ? (
          <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
            <ArrowUpRight className="size-4 text-muted-foreground" />
            <span>{parentName}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic px-2">
            -- Cấp cao nhất --
          </span>
        )}
      </TableCell>

      {/* 4. Created At */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>
            {area.createdAt
              ? format(new Date(area.createdAt), "dd/MM/yyyy", { locale: vi })
              : "--"}
          </span>
        </div>
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
            <DropdownMenuItem onClick={() => onEdit(area)}>
              <Edit className="size-4 mr-2" /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyId}>
              <Copy className="size-4 mr-2" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => onDelete(area)}
            >
              <Trash2 className="size-4 mr-2" /> Xóa bỏ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
AreaTableRow.displayName = "AreaTableRow";

// ============================================================================
// 3. MAIN TABLE COMPONENT
// ============================================================================

interface AreaTableProps {
  data: IArea[];
  isLoading: boolean;
  onEdit: (area: IArea) => void;
  onDelete: (area: IArea) => void;
}

export const AreaTable: React.FC<AreaTableProps> = ({
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
            <TableHead className="w-[300px] text-xs font-bold uppercase text-muted-foreground pl-4">
              Tên khu vực
            </TableHead>
            <TableHead className="w-[180px] text-xs font-bold uppercase text-muted-foreground">
              Cấp hành chính
            </TableHead>
            <TableHead className="hidden sm:table-cell text-xs font-bold uppercase text-muted-foreground">
              Trực thuộc
            </TableHead>
            <TableHead className="hidden md:table-cell w-[150px] text-xs font-bold uppercase text-muted-foreground">
              Ngày tạo
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : data.length > 0 ? (
            data.map((area) => (
              <AreaTableRow
                key={area.id}
                area={area}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <SmartWasteResult
                  status="empty"
                  title="Không tìm thấy khu vực"
                  description="Thử thay đổi bộ lọc hoặc thêm khu vực mới."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
