import { citizenReportService } from "@/config/container";
import { normalizeQueryCitizenReport } from "@/interface/citizenReport.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | Tiếp nhận và khởi tạo báo cáo mới từ công dân
export const createReport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await citizenReportService.create(req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  }
);

// GET | Truy vấn danh sách các phản ánh (Hỗ trợ phân trang và lọc trạng thái)
export const getReports = asyncHandler(async (req: Request, res: Response) => {
  // Chuẩn hóa tham số query từ URL để xử lý phân trang
  const query = normalizeQueryCitizenReport(req.query);

  const data = await citizenReportService.findAll(query);

  res.status(200).json({
    status: "success",
    ...data,
  });
});

// GET | Lấy thông tin chi tiết của một báo cáo qua ID
export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await citizenReportService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});

// PATCH | Cập nhật tiến độ xử lý hoặc nội dung báo cáo phản ánh
export const updateReport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await citizenReportService.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data,
    });
  }
);

// DELETE | Loại bỏ bản ghi báo cáo khỏi hệ thống quản lý
export const deleteReport = asyncHandler(
  async (req: Request, res: Response) => {
    await citizenReportService.delete(req.params.id);

    // Trả về trạng thái 204 No Content khi xóa thành công
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
