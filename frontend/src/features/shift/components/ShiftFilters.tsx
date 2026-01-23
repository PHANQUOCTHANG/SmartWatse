import React from "react";
import { ShiftStatus, ShiftType } from "../types";

export const ShiftFilters: React.FC<{
  onChange: (k: string, v: any) => void;
}> = ({ onChange }) => {
  return (
    <div className="flex gap-2 items-center">
      <select
        onChange={(e) => onChange("shiftType", e.target.value)}
        className="p-2 border"
      >
        <option value="">All Types</option>
        <option value={ShiftType.DRIVER}>Driver</option>
        <option value={ShiftType.JANITOR}>Janitor</option>
      </select>

      <select
        onChange={(e) => onChange("status", e.target.value)}
        className="p-2 border"
      >
        <option value="">All Status</option>
        <option value={ShiftStatus.ON_DUTY}>On Duty</option>
        <option value={ShiftStatus.PAUSED}>Paused</option>
        <option value={ShiftStatus.COMPLETED}>Completed</option>
      </select>
    </div>
  );
};
