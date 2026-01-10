import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { IArea } from "@/interface/area.interface";
import { Area, IAreaDocument } from "@/models/area.model";

export interface IAreaRepository {
  create(data: Partial<IArea>): Promise<IAreaDocument>;
  findById(id: string): Promise<IAreaDocument | null>;
  updateById(id: string, data: Partial<IArea>): Promise<IAreaDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery & { parentId?: number }): Promise<IPaginatedResult<IAreaDocument>>;
}

export class AreaRepository implements IAreaRepository {
  // Tạo khu vực mới
  async create(data: Partial<IArea>): Promise<IAreaDocument> {
    return Area.create(data);
  }

  // Tìm khu vực theo ID
  async findById(id: string): Promise<IAreaDocument | null> {
    return Area.findById(id).exec();
  }

  // Cập nhật khu vực theo ID
  async updateById(id: string, data: Partial<IArea>): Promise<IAreaDocument | null> {
    return Area.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  // Xóa khu vực theo ID
  async deleteById(id: string): Promise<void> {
    await Area.findByIdAndDelete(id).exec();
  }

  // Lấy danh sách có phân trang và lọc theo parentId
  async findAll(query: BaseQuery & { parentId?: number }): Promise<IPaginatedResult<IAreaDocument>> {
    const { page = 1, limit = 10, search, sort = { createdAt: -1 }, parentId } = query;

    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (parentId) filter.parentId = parentId;

    const [data, total] = await Promise.all([
      Area.find(filter).sort(sort as any).skip((page - 1) * limit).limit(limit).exec(),
      Area.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}