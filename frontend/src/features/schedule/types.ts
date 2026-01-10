export type ScheduleStatus = "DONE" | "IN_PROGRESS" | "ALERT";

export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  status: ScheduleStatus;
}
