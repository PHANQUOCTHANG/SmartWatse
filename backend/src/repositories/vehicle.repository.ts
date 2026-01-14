import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { Vehicle, IVehicleDocument } from "@/models/vehicle.model";
import { IVehicle } from "@/interface/vehicle.interface";

export interface IVehicleRepository {
  create(data: Partial<IVehicle>): Promise<IVehicleDocument>;
  findById(id: string): Promise<IVehicleDocument | null>;
  findByPlateNumber(plateNumber: string): Promise<IVehicleDocument | null>;
  updateById(
    id: string,
    data: Partial<IVehicle>
  ): Promise<IVehicleDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<IVehicleDocument>>;
}

export class VehicleRepository implements IVehicleRepository {
  // Lưu trữ thông tin xe mới vào cơ sở dữ liệu
  async create(data: Partial<IVehicle>) {
    return Vehicle.create(data);
  }

  // Truy vấn chi tiết xe theo ID hệ thống
  async findById(id: string) {
    return Vehicle.findById(id).exec();
  }

  // Kiểm tra sự tồn tại của xe thông qua biển số
  async findByPlateNumber(plateNumber: string) {
    return Vehicle.findOne({ plateNumber }).exec();
  }

  // Cập nhật thông tin xe và thực hiện kiểm tra ràng buộc dữ liệu
  async updateById(id: string, data: Partial<IVehicle>) {
    return Vehicle.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  // Loại bỏ xe khỏi danh sách quản lý
  async deleteById(id: string) {
    await Vehicle.findByIdAndDelete(id).exec();
  }

  // Lấy danh sách xe có phân trang và hỗ trợ tìm kiếm theo biển số
  async findAll(query: BaseQuery): Promise<IPaginatedResult<IVehicleDocument>> {
    const { page = 1, limit = 10, search, sort = { createdAt: -1 } } = query;
    const filter = search
      ? { plateNumber: { $regex: search, $options: "i" } }
      : {};

    const [data, total] = await Promise.all([
      Vehicle.find(filter)
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Vehicle.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
