import {
  Clock,
  MapPin,
  AlertCircle,
  Loader,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";

interface Schedule {
  _id?: string;
  id?: string;
  name: string;
  areaId?: { _id?: string; name: string };
  startTime?: string;
  endTime?: string;
  frequency?: string;
  scheduledDate?: string;
}

// ScheduleItem Component
const ScheduleItem = ({
  schedule,
  onCreateTask,
}: {
  schedule: Schedule;
  onCreateTask: (id: string) => void;
}) => {
  const frequencyConfig = {
    DAILY: { label: "Hàng ngày", color: "bg-blue-100 text-blue-700" },
    WEEKLY: { label: "Hàng tuần", color: "bg-purple-100 text-purple-700" },
    MONTHLY: { label: "Hàng tháng", color: "bg-green-100 text-green-700" },
  };

  const freq =
    frequencyConfig[schedule.frequency as keyof typeof frequencyConfig] ||
    frequencyConfig.DAILY;

  return (
    <div className="group px-4 py-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200">
      {/* Top row: Title + Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
            {schedule.name}
          </h4>
          <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {schedule.areaId?.name || "Khu vực chưa xác định"}
            </span>
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${freq.color}`}
        >
          {freq.label}
        </span>
      </div>

      {/* Time + Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded px-2.5 py-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {schedule.startTime || "08:00"} - {schedule.endTime || "17:00"}
          </span>
        </div>
        <button
          onClick={() => onCreateTask(schedule._id || schedule.id || "")}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200 group-hover:shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Task
        </button>
      </div>
    </div>
  );
};

// Skeleton Loader
const SkeletonItem = () => (
  <div className="px-4 py-3 border-b border-gray-100 animate-pulse">
    <div className="flex justify-between gap-3 mb-2">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-16 flex-shrink-0" />
    </div>
    <div className="h-8 bg-gray-100 rounded w-full" />
  </div>
);

// Main Component
const UnassignedScheduleList = () => {
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["schedules-unassigned"],
    queryFn: () => scheduleApi.getAll({ page: 1, limit: 100 }),
  });

  const schedulesList = (schedules as any)?.data || [];

  const handleCreateTask = (scheduleId: string) => {
    console.log("Tạo task từ lịch:", scheduleId);
    // TODO: Mở modal tạo task với scheduleId được điền sẵn
  };

  const handleAddSchedule = () => {
    console.log("Thêm lịch trình mới");
    // TODO: Mở modal tạo lịch trình
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* ===== Header ===== */}
      <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Lịch Trình Sẵn Sàng
            </h3>
            <p className="text-xs text-blue-100">
              {schedulesList.length} lịch trình chờ phân công
            </p>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : schedulesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-3 bg-gray-100 rounded-full mb-3">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Không có lịch trình nào
            </p>
            <p className="text-xs text-gray-500 text-center">
              Tạo lịch trình mới để bắt đầu phân công nhiệm vụ
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {schedulesList.map((schedule: Schedule) => (
              <ScheduleItem
                key={schedule._id || schedule.id}
                schedule={schedule}
                onCreateTask={handleCreateTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== Footer ===== */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleAddSchedule}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm lịch trình mới
        </button>
      </div>
    </div>
  );
};

export default UnassignedScheduleList;
