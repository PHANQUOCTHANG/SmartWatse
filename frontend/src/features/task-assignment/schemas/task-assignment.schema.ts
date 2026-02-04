import { z } from "zod";

// Schema for creating a new task
export const createTaskSchema = z.object({
  scheduleId: z.string().optional().default(""),
  vehicleId: z.string().optional().default(""),
  staffIds: z.array(z.string()).min(1, "Phải chọn ít nhất 1 nhân viên"),
  note: z.string().optional().default(""),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

// Schema for updating a task (all fields optional)
export const updateTaskSchema = z.object({
  scheduleId: z.string().optional(),
  vehicleId: z.string().optional(),
  staffIds: z
    .array(z.string())
    .min(1, "Phải chọn ít nhất 1 nhân viên")
    .optional(),
  note: z.string().optional(),
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
