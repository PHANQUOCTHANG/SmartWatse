import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { CollectionSchedule, ICollectionScheduleDocument } from "@/models/collectionSchedule.model";
import { ICollectionSchedule } from "@/interface/collectionSchedule.interface";

export interface ICollectionScheduleRepository {
  create(data: Partial<ICollectionSchedule>): Promise<ICollectionScheduleDocument>;
  findById(id: string): Promise<ICollectionScheduleDocument | null>;
  updateById(id: string, data: Partial<ICollectionSchedule>): Promise<ICollectionScheduleDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<ICollectionScheduleDocument>>;
}

export class CollectionScheduleRepository implements ICollectionScheduleRepository {
  // Ghi nhận lịch trình thu gom mới vào hệ thống
  async create(data: Partial<ICollectionSchedule>) { return CollectionSchedule.create(data); }

  // Truy vấn chi tiết một lịch trình cụ thể
  async findById(id: string) { return CollectionSchedule.findById(id).exec(); }

  // Cập nhật thông tin phân bổ xe hoặc thời gian thu gom
  async updateById(id: string, data: Partial<ICollectionSchedule>) { 
    return CollectionSchedule.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec(); 
  }

  // Hủy bỏ lịch trình thu gom khỏi cơ sở dữ liệu
  async deleteById(id: string) { await CollectionSchedule.findByIdAndDelete(id).exec(); }

  // Lấy danh sách lịch trình kèm phân trang và lọc dữ liệu
  async findAll(query: BaseQuery): Promise<IPaginatedResult<ICollectionScheduleDocument>> {
    const { page = 1, limit = 10, search, sort = { scheduledDate: 1 } } = query;
    const filter = search ? { areaId: search } : {}; // Tìm chính xác theo AreaId nếu search được truyền

    const [data, total] = await Promise.all([
      CollectionSchedule.find(filter).sort(sort as any).skip((page - 1) * limit).limit(limit).exec(),
      CollectionSchedule.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}