import {
  CollectionTask,
  ICollectionTaskDocument,
} from "@/models/collectionTask.model";
import {
  ICollectionTask,
  QueryCollectionTask,
} from "@/interface/collectionTask.interface";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";

export interface ICollectionTaskRepository {
  create(data: Partial<ICollectionTask>): Promise<ICollectionTaskDocument>;
  findById(id: string): Promise<ICollectionTaskDocument | null>;
  findAll(
    query: QueryCollectionTask,
  ): Promise<IPaginatedResult<ICollectionTaskDocument>>;
  updateById(
    id: string,
    data: Partial<ICollectionTask>,
  ): Promise<ICollectionTaskDocument | null>;
  deleteById(id: string): Promise<ICollectionTaskDocument | null>;
}

export class CollectionTaskRepository implements ICollectionTaskRepository {
  // Tạo bản ghi nhiệm vụ mới vào database
  async create(data: Partial<ICollectionTask>) {
    return CollectionTask.create(data);
  }

  // Lấy chi tiết nhiệm vụ kèm dữ liệu liên kết từ các bảng khác
  async findById(id: string) {
    return CollectionTask.findById(id)
      .populate({
        path: "scheduleId",
        populate: { path: "areaId" },
      })
      .populate("staffIds", `-passwordHash`)
      .populate("vehicleId")
      .exec();
  }

  // Lấy danh sách nhiệm vụ có phân trang và lọc theo điều kiện search, status, khu vực, ngày
  async findAll(
    query: QueryCollectionTask,
  ): Promise<IPaginatedResult<ICollectionTaskDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = { createdAt: -1 },
      areaId,
      status,
      staffId,
      startDate,
      endDate,
    } = query;

    let filter: any = {};

    // 1. Lọc theo search (staffIds hoặc binId)
    if (search) {
      filter.$or = [{ staffId: search }, { binId: search }];
    }
    if (staffId) {
      filter.staffIds = staffId;
    }
    // 2. Lọc theo status
    if (status) {
      filter.status = status;
    }

    // 3. Lọc theo khu vực (thông qua scheduleId -> areaId)
    if (areaId) {
      // Tìm tất cả schedule có areaId này rồi lọc task
      filter["scheduleId.areaId"] = areaId;
    }

    // 4. Xử lý lọc ngày an toàn (dựa trên createdAt của task)
    if (startDate || endDate) {
      const dateFilter: any = {};

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

          // Kiểm tra xem date có hợp lệ không
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

      // Chỉ gán vào filter nếu parse thành công
      if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
      }
    }

    const [data, total] = await Promise.all([
      CollectionTask.find(filter)
        .populate({
          path: "scheduleId",
          populate: { path: "areaId" },
        })
        .populate("staffIds", "-passwordHash")
        .populate("vehicleId")
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      CollectionTask.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // Cập nhật thông tin nhiệm vụ và trả về bản ghi đã populate mới nhất
  async updateById(id: string, data: Partial<ICollectionTask>) {
    return CollectionTask.findByIdAndUpdate(id, data, { new: true })
      .populate({
        path: "scheduleId",
        populate: { path: "areaId" },
      })
      .populate("staffIds", "-passwordHash")
      .populate("vehicleId")
      .exec();
  }

  // Xóa bỏ hoàn toàn nhiệm vụ theo ID
  async deleteById(id: string) {
    return CollectionTask.findByIdAndDelete(id).exec();
  }
}
