import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  History,
  ArrowRight,
  MapPin,
  MoreHorizontal,
  FileClock,
} from "lucide-react";

// Components
import PageHeader from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Logic & Types
import { useStaffHistory } from "@/features/task-assignment/hooks/useStaffHistory";
import Pagination from "@/utils/pagination";
import { ITask, TaskStatus } from "@/features/task-assignment/types";
import {
  HistoryFilterParams,
  StaffTaskHistoryFilter,
} from "@/features/task-assignment/components/StaffTaskHistoryFilter";

const StaffTaskHistoryPage = () => {
  const navigate = useNavigate();

  // 1. STATE QUẢN LÝ TOÀN BỘ FILTER (Page & Limit nằm ở đây)
  const [filterParams, setFilterParams] = useState<HistoryFilterParams>({
    keyword: "",
    status: "ALL",
    date: undefined,
    page: 1,
    limit: 10,
  });

  // 2. GỌI HOOK (Truyền state vào hook)
  const { tasks, meta, isLoading, refetch } = useStaffHistory(filterParams);

  // 3. Helper render badge
  const renderStatusBadge = (status: string) => {
    if (status === TaskStatus.DONE) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
          Hoàn thành
        </Badge>
      );
    }
    if (status === TaskStatus.CANCELLED) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
        >
          Đã hủy
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <PageHeader
        title="Nhật ký công việc"
        subtitle="Tra cứu lịch sử và hiệu suất thực hiện nhiệm vụ."
      />

      {/* FILTER CONTROL */}
      <StaffTaskHistoryFilter
        filters={filterParams}
        onChange={setFilterParams}
        onRefresh={refetch}
      />

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-slate-100" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="bg-slate-50 p-4 rounded-full mb-3">
              <FileClock className="size-8 opacity-50" />
            </div>
            <p className="font-medium">Không tìm thấy dữ liệu lịch sử.</p>
            <p className="text-xs mt-1">
              Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">Mã NV</TableHead>
                  <TableHead className="min-w-[200px]">
                    Nhiệm vụ / Khu vực
                  </TableHead>
                  <TableHead className="min-w-[150px]">Thời gian</TableHead>
                  <TableHead>Phương tiện</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: ITask) => (
                  <TableRow
                    key={task.id}
                    className="group hover:bg-slate-50/60 transition-colors cursor-pointer md:cursor-auto"
                    onClick={() =>
                      window.innerWidth < 768 &&
                      navigate(`/staff/tasks/${task.id}`)
                    }
                  >
                    <TableCell className="font-mono text-xs font-medium text-slate-500">
                      #{task.id?.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {task.schedule?.name || "Nhiệm vụ thu gom"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin size={10} className="text-indigo-500" />
                          <span className="truncate max-w-[180px]">
                            {task.schedule?.areaId?.name ||
                              "Chưa cập nhật khu vực"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-slate-700">
                          {task.schedule?.scheduledDate
                            ? format(
                                new Date(task.schedule.scheduledDate),
                                "dd/MM/yyyy",
                              )
                            : "--/--/----"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono mt-0.5">
                          {task.actualStartTime
                            ? format(new Date(task.actualStartTime), "HH:mm")
                            : "--:--"}
                          {" - "}
                          {task.actualEndTime
                            ? format(new Date(task.actualEndTime), "HH:mm")
                            : "--:--"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.vehicle ? (
                        <div className="text-xs">
                          <div className="font-bold text-slate-700">
                            {task.vehicle.plateNumber}
                          </div>
                          <div className="text-slate-400 uppercase text-[10px]">
                            {task.vehicle.type}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          --
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(task.status as string)}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Mobile Actions */}
                      <div
                        className="md:hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/staff/tasks/${task.id}`)
                              }
                            >
                              Xem chi tiết
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {/* Desktop Actions */}
                      <div className="hidden md:block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs gap-1"
                          onClick={() => navigate(`/staff/tasks/${task.id}`)}
                        >
                          Chi tiết <ArrowRight size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && tasks.length > 0 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={filterParams.page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) =>
              setFilterParams((prev) => ({ ...prev, page: newPage }))
            }
            totalItems={meta.total}
            itemsPerPage={filterParams.limit}
          />
        </div>
      )}
    </div>
  );
};

export default StaffTaskHistoryPage;
