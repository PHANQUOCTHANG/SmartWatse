import TaskDetailCard from "./TaskDetailCard";
import UrgentAlerts from "./UrgentAlerts";

export default function ScheduleRightPanel() {
  return (
    <div className="space-y-4">
      <UrgentAlerts />
      <TaskDetailCard />
    </div>
  );
}
