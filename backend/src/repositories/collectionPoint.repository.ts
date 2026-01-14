import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { CollectionPoint, ICollectionPointDocument } from "@/models/collectionPoint.model";
import { ICollectionPoint } from "@/interface/collectionPoint.interface";

export interface ICollectionPointRepository {
  create(data: Partial<ICollectionPoint>): Promise<ICollectionPointDocument>;
  findById(id: string): Promise<ICollectionPointDocument | null>;
  updateById(id: string, data: Partial<ICollectionPoint>): Promise<ICollectionPointDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<ICollectionPointDocument>>;
}

export class CollectionPointRepository implements ICollectionPointRepository {
  // Lưu mới bản ghi điểm tập kết vào cơ sở dữ liệu
  async create(data: Partial<ICollectionPoint>): Promise<ICollectionPointDocument> {
    return CollectionPoint.create(data);
  }

  // Truy vấn chi tiết bản ghi theo ID
  async findById(id: string): Promise<ICollectionPointDocument | null> {
    return CollectionPoint.findById(id).exec();
  }

  // Cập nhật thông tin bản ghi và thực hiện kiểm tra ràng buộc dữ liệu
  async updateById(id: string, data: Partial<ICollectionPoint>): Promise<ICollectionPointDocument | null> {
    return CollectionPoint.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  // Loại bỏ vĩnh viễn bản ghi khỏi hệ thống
  async deleteById(id: string): Promise<void> {
    await CollectionPoint.findByIdAndDelete(id).exec();
  }

  // Thực hiện truy vấn danh sách, hỗ trợ phân trang và tìm kiếm theo tên
  async findAll(query: BaseQuery): Promise<IPaginatedResult<ICollectionPointDocument>> {
    const { page = 1, limit = 10, search, sort = { createdAt: -1 } } = query;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const [data, total] = await Promise.all([
      CollectionPoint.find(filter).sort(sort as any).skip((page - 1) * limit).limit(limit).exec(),
      CollectionPoint.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}