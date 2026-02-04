import React from "react";
import type { IShift } from "../types";

export const ShiftTable: React.FC<{ shifts: IShift[] }> = ({ shifts }) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th>Staff</th>
          <th>Vehicle</th>
          <th>Type</th>
          <th>Status</th>
          <th>Start Time</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((s) => (
          <tr key={s.id}>
            <td>{s.staffName}</td>
            <td>{s.vehicleCode || "-"}</td>
            <td>{s.shiftType}</td>
            <td>{s.status}</td>
            <td>{new Date(s.startTime).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
