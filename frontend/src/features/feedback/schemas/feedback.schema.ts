import { z } from "zod";
import { FeedbackStatus } from "../types";

// --- ENUMS ---
export const FeedbackStatusEnum = z.enum([
  FeedbackStatus.NEW,
  FeedbackStatus.PROCESSING,
  FeedbackStatus.RESOLVED,
]);

// --- CREATE FEEDBACK SCHEMA ---
export const createFeedbackSchema = z.object({
  citizenId: z.string().min(1, "ID công dân không được để trống").trim(),
  binId: z.string().min(1, "ID thùng rác không được để trống").optional(),
  description: z
    .string()
    .min(10, "Mô tả phản ánh phải có ít nhất 10 ký tự")
    .max(1000, "Mô tả phản ánh quá dài (tối đa 1000 ký tự)")
    .trim(),
  imageUrl: z
    .string()
    .url("URL hình ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

// --- UPDATE FEEDBACK SCHEMA ---
export const updateFeedbackSchema = z.object({
  status: FeedbackStatusEnum,
  description: z
    .string()
    .min(10, "Mô tả phản ánh phải có ít nhất 10 ký tự")
    .max(1000, "Mô tả phản ánh quá dài (tối đa 1000 ký tự)")
    .trim()
    .optional(),
});

export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;

// --- FILTER SCHEMA ---
export const feedbackFilterSchema = z.object({
  page: z.number().min(1, "Trang phải >= 1").default(1),
  limit: z
    .number()
    .min(1, "Limit phải >= 1")
    .max(100, "Limit <= 100")
    .default(10),
  keyword: z.string().trim().optional(),
  status: z.string().optional(),
  citizenId: z.string().optional(),
  binId: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "status", "description"])
    .default("createdAt")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type FeedbackFilterInput = z.infer<typeof feedbackFilterSchema>;
