import { useState, useRef } from "react";
import { RotateCw } from "lucide-react";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";
import { toast } from "sonner";
import { ISchedule } from "@/features/schedule/types";
import ScheduleHeader from "@/features/schedule/components/ScheduleHeader";
import ScheduleStats from "@/features/schedule/components/ScheduleStats";
import ScheduleCalendar from "@/features/schedule/components/ScheduleCalendar";
import ScheduleRightPanel from "@/features/schedule/components/ScheduleRightPanel";

export default function ManagerSchedulePage() {
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(
    null,
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const calendarRef = useRef<{ refetch: () => void }>(null);

  const handleRefresh = () => {
    calendarRef.current?.refetch();
  };

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      handleRefresh();
      toast.success("Đã cập nhật lịch trình");
    } catch (error) {
      console.error("Lỗi khi refresh:", error);
      toast.error("Không thể cập nhật");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefreshDetail = async () => {
    if (!selectedSchedule?.id) return;
    try {
      const data = await scheduleApi.getById(selectedSchedule.id);
      setSelectedSchedule(data);
      handleRefresh(); // Refresh calendar too
    } catch (error) {
      console.error("Lỗi khi refresh chi tiết:", error);
      toast.error("Không thể cập nhật chi tiết lịch");
    }
  };

  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    setSelectedSchedule(null); // Reset selected schedule khi đổi khu vực
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lịch thu gom rác
        </h1>
        <div className="flex items-center gap-3">
          <ScheduleHeader
            onRefresh={handleRefresh}
            selectedAreaId={selectedAreaId}
            onAreaChange={handleAreaChange}
          />
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tải lại dữ liệu"
          >
            <RotateCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      <ScheduleStats />
      <div className="grid grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="col-span-8">
          <ScheduleCalendar
            ref={calendarRef}
            onScheduleClick={setSelectedSchedule}
            selectedAreaId={selectedAreaId}
          />
        </div>

        {/* Right panel */}
        <div className="col-span-4">
          <ScheduleRightPanel
            selectedSchedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onRefresh={handleRefresh}
            onRefreshDetail={handleRefreshDetail}
          />
        </div>
      </div>
    </div>
  );
}
