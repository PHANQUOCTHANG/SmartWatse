import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { AreaFilter, IArea } from "@/interface/area.interface";
import { Area, IAreaDocument } from "@/models/area.model";
import mongoose, { Types } from "mongoose";

export interface IAreaRepository {
  create(data: Partial<IArea>): Promise<IAreaDocument>;
  findById(id: string): Promise<IAreaDocument | null>;
  findByNameAndParent(
    name: string,
    parentId: string | null,
  ): Promise<IAreaDocument | null>;
  updateById(id: string, data: Partial<IArea>): Promise<IAreaDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(
    query: BaseQuery & { parentId?: string; type?: string },
  ): Promise<IPaginatedResult<IAreaDocument>>;
  hasChildren(id: string): Promise<boolean>;
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
  // src/repositories/area.repository.ts

  async findByNameAndParent(
    name: string,
    parentId: string | null,
  ): Promise<IAreaDocument | null> {
    const filter: any = { name };

    if (parentId) {
      filter.parentId = new Types.ObjectId(parentId);
    } else {
      filter.parentId = null;
    }

    return Area.findOne(filter).exec();
  }

  async hasChildren(id: string): Promise<boolean> {
    // ✅ Hết lỗi
    const count = await Area.countDocuments({
      parentId: new Types.ObjectId(id),
    });
    return count > 0;
  }
  // Cập nhật khu vực theo ID
  async updateById(
    id: string,
    data: Partial<IArea>,
  ): Promise<IAreaDocument | null> {
    return Area.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  // Xóa khu vực theo ID
  async deleteById(id: string): Promise<void> {
    await Area.findByIdAndDelete(id).exec();
  }

  // Lấy danh sách có phân trang và lọc theo parentId
  async findAll(
    query: BaseQuery<AreaFilter>,
  ): Promise<IPaginatedResult<IAreaDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "-createdAt",
      filter: AreaFilter = {},
    } = query;
    const filter: any = { ...AreaFilter };
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const [data, total] = await Promise.all([
      Area.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("parentId", "name")
        .lean() //
        .exec(),
      Area.countDocuments(filter).exec(),
    ]);

    return {
      data: data as IAreaDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
