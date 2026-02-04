import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import {
  CollectionSchedule,
  ICollectionScheduleDocument,
} from "@/models/collectionSchedule.model";
import {
  ICollectionSchedule,
  QueryCollectionSchedule,
} from "@/interface/collectionSchedule.interface";

export interface ICollectionScheduleRepository {
  create(
    data: Partial<ICollectionSchedule>,
  ): Promise<ICollectionScheduleDocument>;
  findById(id: string): Promise<ICollectionScheduleDocument | null>;
  updateById(
    id: string,
    data: Partial<ICollectionSchedule>,
  ): Promise<ICollectionScheduleDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(
    query: QueryCollectionSchedule,
  ): Promise<IPaginatedResult<ICollectionScheduleDocument>>;
}

export class CollectionScheduleRepository implements ICollectionScheduleRepository {
  // Ghi nhận lịch trình thu gom rác mới vào cơ sở dữ liệu
  async create(
    data: Partial<ICollectionSchedule>,
  ): Promise<ICollectionScheduleDocument> {
    return CollectionSchedule.create(data);
  }

  // Truy xuất chi tiết một lịch trình cụ thể bao gồm cả thông tin khu vực (populate)
  async findById(id: string): Promise<ICollectionScheduleDocument | null> {
    return CollectionSchedule.findById(id).populate("areaId").exec();
  }

  // Cập nhật các thông số thời gian, tên hoặc tần suất lặp lại của lịch trình
  async updateById(
    id: string,
    data: Partial<ICollectionSchedule>,
  ): Promise<ICollectionScheduleDocument | null> {
    return CollectionSchedule.findByIdAndUpdate(id, data, {
      new: true, // Trả về bản ghi sau khi đã cập nhật
      runValidators: true, // Kiểm tra ràng buộc Schema khi update
    }).exec();
  }

  // Loại bỏ hoàn toàn lịch trình thu gom khỏi hệ thống
  async deleteById(id: string): Promise<void> {
    await CollectionSchedule.findByIdAndDelete(id).exec();
  }

  // Lấy danh sách lịch trình kèm phân trang, tìm kiếm theo tên hoặc lọc theo AreaId và ngày
  async findAll(
    query: QueryCollectionSchedule,
  ): Promise<IPaginatedResult<ICollectionScheduleDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = { scheduledDate: 1 },
      areaId,
      startDate,
      endDate,
    } = query;

    let filter: any = {};

    // 1. Lọc theo tên
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 2. Lọc theo khu vực
    if (areaId) {
      filter.areaId = areaId;
    }

    // 3. Xử lý lọc ngày an toàn
    if (startDate || endDate) {
      const dateFilter: any = {};

      // Hàm xử lý parse date để dùng chung
      const parseSafeDate = (d: any, isEnd: boolean): Date | null => {
        try {
          if (!d) return null;
          let targetDate: Date;

          // Nếu là chuỗi YYYY-MM-DD
          if (typeof d === "string" && d.includes("-")) {
            const [y, m, d_part] = d.split("-").map(Number);
            targetDate = new Date(y, m - 1, d_part);
          } else {
            targetDate = new Date(d);
          }

          // Kiểm tra xem date có hợp lệ không (isNaN)
          if (isNaN(targetDate.getTime())) return null;

          if (isEnd) targetDate.setHours(23, 59, 59, 999);
          else targetDate.setHours(0, 0, 0, 0);

          return targetDate;
        } catch {
          return null;
        }
      };

      const start = parseSafeDate(startDate, false);
      if (start) dateFilter.$gte = start;

      const end = parseSafeDate(endDate, true);
      if (end) dateFilter.$lte = end;

      // Chỉ gán vào filter nếu parse thành công, tránh lỗi "Cast to date failed"
      if (Object.keys(dateFilter).length > 0) {
        filter.scheduledDate = dateFilter;
      }
    }

    // 4. Thực hiện truy vấn
    const [data, total] = await Promise.all([
      CollectionSchedule.find(filter)
        .populate("areaId")
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      CollectionSchedule.countDocuments(filter).exec(),
    ]);

    return {
      data: data as ICollectionScheduleDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
