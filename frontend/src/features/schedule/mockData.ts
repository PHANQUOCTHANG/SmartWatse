import { ScheduleEvent } from "./types";

export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Route A - Sáng",
    start: "2023-10-09T08:00:00",
    end: "2023-10-09T11:30:00",
    status: "IN_PROGRESS",
  },
  {
    id: "2",
    title: "ALERT - Thùng #102",
    start: "2023-10-09T09:30:00",
    status: "ALERT",
  },
  {
    id: "3",
    title: "Route B - Chiều",
    start: "2023-10-10T14:00:00",
    end: "2023-10-10T17:00:00",
    status: "NORMAL",
  },
];
