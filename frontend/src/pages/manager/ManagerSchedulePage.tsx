import { useState, useRef } from "react";
import ScheduleHeader from "@/features/schedule/components/ScheduleHeader";
import ScheduleStats from "@/features/schedule/components/ScheduleStats";
import ScheduleCalendar from "@/features/schedule/components/ScheduleCalendar";
import ScheduleRightPanel from "@/features/schedule/components/ScheduleRightPanel";

export default function ManagerSchedulePage() {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const calendarRef = useRef<{ refetch: () => void }>(null);

  const handleRefresh = () => {
    calendarRef.current?.refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <ScheduleHeader onRefresh={handleRefresh} />
      <ScheduleStats />

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="col-span-8">
          <ScheduleCalendar
            ref={calendarRef}
            onScheduleClick={setSelectedSchedule}
          />
        </div>

        {/* Right panel */}
        <div className="col-span-4">
          <ScheduleRightPanel
            selectedSchedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}
