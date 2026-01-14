import ScheduleHeader from "../components/ScheduleHeader";
import ScheduleStats from "../components/ScheduleStats";
import ScheduleCalendar from "../components/ScheduleCalendar";
import ScheduleRightPanel from "../components/ScheduleRightPanel";

export default function ManagerSchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <ScheduleHeader />
      <ScheduleStats />

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="col-span-8">
          <ScheduleCalendar />
        </div>

        {/* Right panel */}
        <div className="col-span-4">
          <ScheduleRightPanel />
        </div>
      </div>
    </div>
  );
}
