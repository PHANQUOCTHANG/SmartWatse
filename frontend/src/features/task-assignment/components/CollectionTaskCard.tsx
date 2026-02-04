import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, MapPin, Clock, Truck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ITask, TaskStatus } from "../types";

interface CollectionTaskCardProps {
  task: ITask;
  onViewDetails: (task: ITask) => void;
}

// Helper render badge trạng thái
const getStatusBadge = (status: string | TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING:
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Chờ xử lý
        </Badge>
      );
    case TaskStatus.IN_PROGRESS:
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
        >
          Đang thực hiện
        </Badge>
      );
    case TaskStatus.DONE:
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          Hoàn thành
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200"
        >
          {status}
        </Badge>
      );
  }
};

export const CollectionTaskCard = ({
  task,
  onViewDetails,
}: CollectionTaskCardProps) => {
  // Safe Access (Optional Chaining)
  const scheduleName = task.schedule?.name || "Nhiệm vụ thu gom";
  const areaName = task.schedule?.areaId?.name || "Khu vực chưa xác định";

  // Lấy thời gian từ schedule object nếu có
  const startTime = task.schedule?.startTime || "--:--";
  const endTime = task.schedule?.endTime || "--:--";

  const plateNumber = task.vehicle?.plateNumber || "Chưa gán xe";
  const staffCount = task.staffs?.length || 0;

  // Format Date
  // Ưu tiên lấy date trong schedule, fallback ra ngoài root
  const rawDate = task.schedule?.scheduledDate || task.scheduledDate;
  const dateDisplay = rawDate
    ? format(new Date(rawDate), "EEEE, dd/MM", { locale: vi })
    : "Chưa lên lịch";

  return (
    <Card
      className="group hover:shadow-md transition-all border-slate-200 flex flex-col h-full cursor-pointer"
      onClick={() => onViewDetails(task)}
    >
      {/* HEADER */}
      <CardHeader className="p-4 pb-2 space-y-2 bg-slate-50/50 border-b border-slate-100">
        <div className="flex justify-between items-start gap-2">
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
              {scheduleName}
            </h3>
            <div className="flex items-center text-xs text-slate-500 mt-1">
              <MapPin className="size-3 mr-1 text-slate-400 shrink-0" />
              <span className="truncate">{areaName}</span>
            </div>
          </div>
          <div className="shrink-0">{getStatusBadge(task.status)}</div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-4 flex-1 space-y-3">
        {/* Time Info */}
        <div className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-100">
          <div className="flex items-center text-slate-700 font-medium">
            <Calendar className="size-4 mr-2 text-primary" />
            <span className="capitalize">{dateDisplay}</span>
          </div>
          <div className="flex items-center text-slate-500 text-xs">
            <Clock className="size-3.5 mr-1" />
            {startTime} - {endTime}
          </div>
        </div>

        {/* Resources Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Truck className="size-4 text-slate-400" />
            <span className="truncate font-medium">{plateNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 pl-2 border-l">
            <Users className="size-4 text-slate-400" />
            <span className="font-medium">{staffCount} Nhân sự</span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-3 bg-white border-t border-slate-100">
        <Button
          className="w-full group-hover:bg-primary/5"
          variant="outline"
          size="sm"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};
