import { useState } from "react";
import TaskDetailCard from "./TaskDetailCard";
import UrgentAlerts from "./UrgentAlerts";

interface ScheduleRightPanelProps {
  selectedSchedule?: any;
  onClose?: () => void;
  onRefresh?: () => void;
  onRefreshDetail?: () => void;
}

export default function ScheduleRightPanel({
  selectedSchedule,
  onClose,
  onRefresh,
  onRefreshDetail,
}: ScheduleRightPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4">
      <UrgentAlerts />
      <TaskDetailCard
        schedule={selectedSchedule}
        onClose={onClose}
        isEditing={isEditing}
        onEditChange={setIsEditing}
        onRefresh={onRefreshDetail || onRefresh}
      />
    </div>
  );
}
