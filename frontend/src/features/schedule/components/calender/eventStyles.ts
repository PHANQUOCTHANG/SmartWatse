import { ScheduleStatus } from "../../types";

export function getEventClass(status: ScheduleStatus) {
  switch (status) {
    case "ALERT":
      return "bg-red-100 text-red-700 border border-red-200";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "DONE":
      return "bg-green-100 text-green-700 border border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}
