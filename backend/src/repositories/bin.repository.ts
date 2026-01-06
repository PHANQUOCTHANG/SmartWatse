import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { Bin, IBinDocument } from "@/models/bin.model";
import { IBin } from "@/interface/bin.interface";

export interface IBinRepository {
  create(data: Partial<IBin>): Promise<IBinDocument>;
  findById(id: string): Promise<IBinDocument | null>;
  findByCode(code: string): Promise<IBinDocument | null>;
  updateById(id: string, data: Partial<IBin>): Promise<IBinDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<IBinDocument>>;
}

export class BinRepository implements IBinRepository {
  // Tạo mới thùng rác vào cơ sở dữ liệu
  async create(data: Partial<IBin>) {
    return Bin.create(data);
  }

  // Tìm kiếm thùng rác theo ID hệ thống
  async findById(id: string) {
    return Bin.findById(id).exec();
  }

  // Truy vấn nhanh thùng rác qua mã định danh duy nhất
  async findByCode(code: string) {
    return Bin.findOne({ code }).exec();
  }

  // Cập nhật thông số kỹ thuật và thực thi kiểm tra tính hợp lệ của dữ liệu
  async updateById(id: string, data: Partial<IBin>) {
    return Bin.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  // Loại bỏ hoàn toàn bản ghi khỏi hệ thống
  async deleteById(id: string) {
    await Bin.findByIdAndDelete(id).exec();
  }

  // Thực hiện tìm kiếm danh sách kèm phân trang và sắp xếp mặc định theo ngày tạo
  async findAll(query: BaseQuery): Promise<IPaginatedResult<IBinDocument>> {
    const { page = 1, limit = 10, search, sort = { createdAt: -1 } } = query;
    const filter = search ? { code: { $regex: search, $options: "i" } } : {};

    const [data, total] = await Promise.all([
      Bin.find(filter)
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Bin.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
