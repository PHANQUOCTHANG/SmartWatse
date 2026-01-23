import { z } from "zod";
import { ShiftType } from "../types";

export const startShiftSchema = z.object({
  shiftType: z.nativeEnum(ShiftType),
  vehicleId: z.string().optional(),
  startLatitude: z.number().min(-90).max(90),
  startLongitude: z.number().min(-180).max(180),
  startAddress: z.string().optional(),
});

export const endShiftSchema = z.object({
  endLatitude: z.number().min(-90).max(90).optional(),
  endLongitude: z.number().min(-180).max(180).optional(),
  endAddress: z.string().optional(),
  totalDistance: z.number().min(0).optional(),
  totalCollectedBin: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type StartShiftFormValues = z.infer<typeof startShiftSchema>;
export type EndShiftFormValues = z.infer<typeof endShiftSchema>;
