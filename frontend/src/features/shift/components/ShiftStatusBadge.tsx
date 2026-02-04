import React from "react";
import { ShiftStatus } from "../types";

export const ShiftStatusBadge: React.FC<{ status: ShiftStatus }> = ({
  status,
}) => {
  const color =
    status === ShiftStatus.ON_DUTY
      ? "bg-green-200"
      : status === ShiftStatus.PAUSED
        ? "bg-yellow-200"
        : "bg-gray-200";
  return <span className={`${color} px-2 py-1 rounded`}>{status}</span>;
};
