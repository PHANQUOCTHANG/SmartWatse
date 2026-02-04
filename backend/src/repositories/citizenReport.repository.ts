import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import {
  CitizenReport,
  ICitizenReportDocument,
} from "@/models/citizenReport.model";
import {
  ICitizenReport,
  QueryCitizenReport,
} from "@/interface/citizenReport.interface";

export interface ICitizenReportRepository {
  create(data: Partial<ICitizenReport>): Promise<ICitizenReportDocument>;
  findById(id: string): Promise<ICitizenReportDocument | null>;
  updateById(
    id: string,
    data: Partial<ICitizenReport>,
  ): Promise<ICitizenReportDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(
    query: QueryCitizenReport,
  ): Promise<IPaginatedResult<ICitizenReportDocument>>;
}

export class CitizenReportRepository implements ICitizenReportRepository {
  // Ghi nhận báo cáo mới từ người dân vào hệ thống
  async create(data: Partial<ICitizenReport>) {
    return CitizenReport.create(data);
  }

  // Xem chi tiết nội dung báo cáo và hình ảnh đính kèm
  async findById(id: string) {
    return CitizenReport.findById(id)
      .populate("citizenId", "-passwordHash")
      .populate("areaId")
      .populate("collectionPointId")
      .populate("binId")
      .exec();
  }

  // Cập nhật trạng thái xử lý (NEW -> PROCESSING -> RESOLVED)
  async updateById(id: string, data: Partial<ICitizenReport>) {
    return CitizenReport.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("citizenId", "-passwordHash")
      .populate("areaId")
      .populate("collectionPointId")
      .populate("binId")
      .exec();
  }

  // Loại bỏ báo cáo sai lệch khỏi hệ thống
  async deleteById(id: string) {
    await CitizenReport.findByIdAndDelete(id).exec();
  }

  // Truy vấn danh sách báo cáo kèm phân trang, lọc và tìm kiếm
  async findAll(
    query: QueryCitizenReport,
  ): Promise<IPaginatedResult<ICitizenReportDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = { createdAt: -1 },
      citizenId,
      areaId,
      binId,
      status,
      startDate,
      endDate,
    } = query;

    // Xây dựng filter object
    const filter: any = {};

    // Lọc theo người dân gửi báo cáo
    if (citizenId) {
      filter.citizenId = citizenId;
    }

    // Lọc theo trạng thái
    if (status) {
      filter.status = status;
    }

    // Lọc theo khu vực
    if (areaId) {
      filter.areaId = areaId;
    }

    // Lọc theo điểm thu gom
    const collectionPointId = (query as any).collectionPointId;
    if (collectionPointId) {
      filter.collectionPointId = collectionPointId;
    }

    // Lọc theo thùng rác
    if (binId) {
      filter.binId = binId;
    }

    // Lọc theo khoảng ngày
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = startDate;
      }
      if (endDate) {
        // Thêm 1 ngày vào endDate để bao gồm cả ngày cuối
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        filter.createdAt.$lt = endOfDay;
      }
    }

    // Tìm kiếm theo từ khóa trong description
    if (search) {
      filter.description = { $regex: search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      CitizenReport.find(filter)
        .populate("citizenId", "-passwordHash")
        .populate("areaId")
        .populate("collectionPointId")
        .populate("binId")
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      CitizenReport.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
