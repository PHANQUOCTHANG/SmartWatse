import { z } from "zod";

// --- ENUMS (Khớp với Backend) ---
export const ReportStatusEnum = z.enum(["NEW", "PROCESSING", "RESOLVED"]);

// --- FILTER SCHEMA ---
export const citizenReportFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  keyword: z.string().optional(),
  status: ReportStatusEnum.optional(),
  citizenId: z.string().optional(),
  binId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// --- CREATE/UPDATE SCHEMA ---
export const citizenReportSchema = z.object({
  citizenId: z.string().min(1, "Người dân là bắt buộc"),
  binId: z.string().optional(),
  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(2000, "Mô tả quá dài"),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ").optional(),
  status: ReportStatusEnum.default("NEW"),
});

export type CitizenReportFilterValues = z.infer<
  typeof citizenReportFilterSchema
>;
export type CitizenReportFormValues = z.infer<typeof citizenReportSchema>;
