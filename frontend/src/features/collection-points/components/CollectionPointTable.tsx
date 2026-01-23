import React, { memo, useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  LayoutGrid,
  Copy,
  Navigation,
  Image as ImageIcon,
  Weight,
  Hash,
  ArrowUpDown,
  ExternalLink,
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
import { toast } from "sonner";
import { ICollectionPoint, CollectionPointStatus } from "../types";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. HELPER CONFIGS
// ============================================================================

const getStatusConfig = (status: CollectionPointStatus) => {
  switch (status) {
    case CollectionPointStatus.ACTIVE:
      return {
        label: "Hoạt động",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    case CollectionPointStatus.MAINTENANCE:
      return {
        label: "Bảo trì",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    case CollectionPointStatus.INACTIVE:
      return {
        label: "Ngưng hoạt động",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      };
    default:
      return {
        label: "Không rõ",
        className: "bg-gray-50 text-gray-600 border-gray-200",
        dot: "bg-gray-400",
      };
  }
};

// ============================================================================
// 2. ROW COMPONENT
// ============================================================================

interface CollectionPointTableRowProps {
  item: ICollectionPoint;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: (item: ICollectionPoint) => void;
  onDelete: (item: ICollectionPoint) => void;
}

const CollectionPointTableRow = memo(
  ({
    item,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
  }: CollectionPointTableRowProps) => {
    const statusConfig = getStatusConfig(item.status);

    const handleCopy = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}`);
    };

    const handleViewMap = () => {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`,
        "_blank",
      );
    };

    return (
      <TableRow
        className={cn(
          "group transition-all hover:bg-slate-50/60 border-b border-slate-100",
          isSelected && "bg-blue-50/60 hover:bg-blue-50/80",
        )}
      >
        {/* CHECKBOX */}
        <TableCell className="w-[40px] pl-4">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>

        {/* 1. INFO: Image + Name + Code */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            {/* Image Thumbnail */}
            <div className="relative size-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 shadow-sm">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-300">
                  <ImageIcon className="size-5" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5 max-w-[220px]">
              <div
                className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600 transition-colors"
                title={item.name}
              >
                {item.name}
              </div>
              <div
                className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer hover:text-blue-500 group/code"
                onClick={() => handleCopy(item.code, "Mã trạm")}
              >
                <Hash className="size-3 shrink-0" />
                <span className="font-mono font-medium">{item.code}</span>
                <Copy className="size-2.5 opacity-0 group-hover/code:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </TableCell>

        {/* 2. STATUS & CAPACITY */}
        <TableCell>
          <div className="flex flex-col items-start gap-1.5">
            <div
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-sm",
                statusConfig.className,
              )}
            >
              <span
                className={cn("size-1.5 rounded-full mr-1.5", statusConfig.dot)}
              />
              {statusConfig.label}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-1">
              <Weight className="size-3.5 text-slate-400" />
              <span>
                Sức chứa: <b>{item.capacity}</b> tấn
              </span>
            </div>
          </div>
        </TableCell>

        {/* 3. AREA & LOCATION */}
        <TableCell>
          <div className="flex flex-col gap-1 max-w-[250px]">
            <div className="flex items-center gap-1.5">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 font-normal h-5 px-1.5"
              >
                {item.areaName || "Chưa phân vùng"}
              </Badge>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 cursor-help">
                    <MapPin className="size-3.5 mt-0.5 shrink-0" />
                    <span className="truncate">
                      {item.address || "Địa chỉ chưa cập nhật"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  {item.address}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>

        {/* 4. ACTIONS */}
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
              className="w-56 border-slate-100 shadow-lg"
            >
              <DropdownMenuItem
                onClick={handleViewMap}
                className="cursor-pointer"
              >
                <Navigation className="size-4 mr-2 text-blue-500" />
                Dẫn đường (Google Maps)
                <ExternalLink className="size-3 ml-auto opacity-50" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="cursor-pointer"
              >
                <Edit className="size-4 mr-2 text-slate-500" /> Chỉnh sửa thông
                tin
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  handleCopy(`${item.latitude}, ${item.longitude}`, "Tọa độ")
                }
                className="cursor-pointer"
              >
                <Copy className="size-4 mr-2 text-slate-500" /> Sao chép tọa độ
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="size-4 mr-2" /> Xóa điểm này
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  },
);
CollectionPointTableRow.displayName = "CollectionPointTableRow";

// ============================================================================
// 3. MAIN TABLE COMPONENT
// ============================================================================

interface CollectionPointTableProps {
  data: ICollectionPoint[];
  isLoading: boolean;
  onEdit: (item: ICollectionPoint) => void;
  onDelete: (item: ICollectionPoint) => void;
  onSort?: (field: string) => void; // Optional Sort Callback
}

export const CollectionPointTable: React.FC<CollectionPointTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSort,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(data.map((i) => i.id)));
    else setSelectedIds(new Set());
  };

  // Handle Single Select
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  // Helper: Sortable Header
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
        sortKey &&
          "cursor-pointer hover:bg-slate-50 hover:text-slate-700 transition-colors",
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
      {/* BULK ACTIONS (Hiện khi có selection) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50/80 border border-blue-100 rounded-lg animate-in slide-in-from-top-2 fade-in shadow-sm">
          <span className="text-sm font-medium text-blue-700">
            Đã chọn <b>{selectedIds.size}</b> địa điểm
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-blue-200 text-blue-700 hover:bg-blue-100 bg-white"
            >
              Xuất báo cáo
            </Button>
            <Button size="sm" variant="destructive" className="h-8 shadow-sm">
              Xóa {selectedIds.size} mục
            </Button>
          </div>
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] pl-4">
                <Checkbox
                  checked={data.length > 0 && selectedIds.size === data.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <SortableHead
                label="Điểm tập kết"
                sortKey="name"
                className="w-[300px]"
              />
              <SortableHead
                label="Trạng thái & Sức chứa"
                sortKey="status"
                className="w-[200px]"
              />
              <SortableHead
                label="Khu vực & Vị trí"
                sortKey="areaName"
                className="w-[250px]"
              />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : data.length > 0 ? (
              data.map((item) => (
                <CollectionPointTableRow
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onSelect={(c) => handleSelectRow(item.id, c)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-80 text-center">
                  <SmartWasteResult
                    status="empty"
                    title="Chưa có dữ liệu"
                    description="Hãy thử thêm điểm tập kết mới hoặc thay đổi bộ lọc tìm kiếm."
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
