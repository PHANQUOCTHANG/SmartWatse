import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  startShiftSchema,
  StartShiftFormValues,
} from "../schemas/shift.schema";
import { useShifts } from "../hooks/useShifts";
import { ShiftType } from "../types";

export const StartShiftForm: React.FC = () => {
  const { startShift, isStarting } = useShifts();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartShiftFormValues>({
    resolver: zodResolver(startShiftSchema),
  });

  const onSubmit = (data: StartShiftFormValues) => {
    startShift(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label>Shift Type</label>
        <select {...register("shiftType")} className="w-full p-2 border">
          <option value={ShiftType.JANITOR}>Janitor</option>
          <option value={ShiftType.DRIVER}>Driver</option>
        </select>
        <p className="text-sm text-red-500">{errors.shiftType?.message}</p>
      </div>

      <div>
        <label>Vehicle ID (required for Driver)</label>
        <input {...register("vehicleId")} className="w-full p-2 border" />
      </div>

      <div>
        <label>Start Latitude</label>
        <input
          type="number"
          step="any"
          {...register("startLatitude", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
        <p className="text-sm text-red-500">{errors.startLatitude?.message}</p>
      </div>

      <div>
        <label>Start Longitude</label>
        <input
          type="number"
          step="any"
          {...register("startLongitude", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
        <p className="text-sm text-red-500">{errors.startLongitude?.message}</p>
      </div>

      <div>
        <label>Start Address</label>
        <input {...register("startAddress")} className="w-full p-2 border" />
      </div>

      <button
        type="submit"
        disabled={isStarting}
        className="px-4 py-2 bg-blue-600 text-white"
      >
        {isStarting ? "Starting..." : "Start Shift"}
      </button>
    </form>
  );
};
