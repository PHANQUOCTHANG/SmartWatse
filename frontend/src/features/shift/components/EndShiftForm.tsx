import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { endShiftSchema, EndShiftFormValues } from "../schemas/shift.schema";
import { useShifts } from "../hooks/useShifts";

export const EndShiftForm: React.FC<{ shiftId: string }> = ({ shiftId }) => {
  const { endShift, isEnding } = useShifts();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EndShiftFormValues>({ resolver: zodResolver(endShiftSchema) });

  const onSubmit = (data: EndShiftFormValues) => {
    endShift(shiftId, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label>End Latitude</label>
        <input
          type="number"
          step="any"
          {...register("endLatitude", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
        <p className="text-sm text-red-500">{errors.endLatitude?.message}</p>
      </div>

      <div>
        <label>End Longitude</label>
        <input
          type="number"
          step="any"
          {...register("endLongitude", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
        <p className="text-sm text-red-500">{errors.endLongitude?.message}</p>
      </div>

      <div>
        <label>Total Distance (km)</label>
        <input
          type="number"
          step="any"
          {...register("totalDistance", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
      </div>

      <div>
        <label>Total Collected Bin</label>
        <input
          type="number"
          {...register("totalCollectedBin", { valueAsNumber: true })}
          className="w-full p-2 border"
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea {...register("notes")} className="w-full p-2 border" />
      </div>

      <button
        type="submit"
        disabled={isEnding}
        className="px-4 py-2 bg-green-600 text-white"
      >
        {isEnding ? "Ending..." : "End Shift"}
      </button>
    </form>
  );
};
