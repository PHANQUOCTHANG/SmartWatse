import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { CitizenReport, ICitizenReportDocument } from "@/models/citizenReport.model";
import { ICitizenReport } from "@/interface/citizenReport.interface";

export interface ICitizenReportRepository {
  create(data: Partial<ICitizenReport>): Promise<ICitizenReportDocument>;
  findById(id: string): Promise<ICitizenReportDocument | null>;
  updateById(id: string, data: Partial<ICitizenReport>): Promise<ICitizenReportDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<ICitizenReportDocument>>;
}

export class CitizenReportRepository implements ICitizenReportRepository {
  // Ghi nhận báo cáo mới từ người dân vào hệ thống
  async create(data: Partial<ICitizenReport>) { return CitizenReport.create(data); }

  // Xem chi tiết nội dung báo cáo và hình ảnh đính kèm
  async findById(id: string) { return CitizenReport.findById(id).exec(); }

  // Cập nhật trạng thái xử lý (NEW -> PROCESSING -> RESOLVED)
  async updateById(id: string, data: Partial<ICitizenReport>) { 
    return CitizenReport.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec(); 
  }

  // Loại bỏ báo cáo sai lệch khỏi hệ thống
  async deleteById(id: string) { await CitizenReport.findByIdAndDelete(id).exec(); }

  // Truy vấn danh sách báo cáo kèm phân trang và lọc theo trạng thái
  async findAll(query: BaseQuery): Promise<IPaginatedResult<ICitizenReportDocument>> {
    const { page = 1, limit = 10, search, sort = { createdAt: -1 } } = query;
    const filter = search ? { status: search } : {};

    const [data, total] = await Promise.all([
      CitizenReport.find(filter).sort(sort as any).skip((page - 1) * limit).limit(limit).exec(),
      CitizenReport.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}