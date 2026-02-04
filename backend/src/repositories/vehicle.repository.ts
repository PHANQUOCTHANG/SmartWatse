import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { Vehicle, IVehicleDocument } from "@/models/vehicle.model";
import { IVehicle, VehicleFilter } from "@/interface/vehicle.interface";

export interface IVehicleRepository {
  create(data: Partial<IVehicle>): Promise<IVehicleDocument>;
  findById(id: string): Promise<IVehicleDocument | null>;
  findByPlateNumber(plateNumber: string): Promise<IVehicleDocument | null>;
  updateById(
    id: string,
    data: Partial<IVehicle>,
  ): Promise<IVehicleDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<IVehicleDocument>>;
  updateLocation(
    id: string,
    lat: number,
    lng: number,
    heading: number,
  ): Promise<IVehicleDocument | null>;
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
  async findAll(
    query: BaseQuery<VehicleFilter>,
  ): Promise<IPaginatedResult<IVehicleDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "-createdAt",
      filter: VehicleFilter = {},
    } = query;
    const filter: any = { ...VehicleFilter };
    if (search) {
      filter.$or = [{ plateNumber: { $regex: search, $options: "i" } }];
    }

    const [data, total] = await Promise.all([
      Vehicle.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Vehicle.countDocuments(filter).exec(),
    ]);

    return {
      data: data as IVehicleDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Cập nhật vị trí xe (API IoT sẽ gọi hàm này liên tục)
  async updateLocation(
    id: string,
    lat: number,
    lng: number,
    heading: number,
  ): Promise<IVehicleDocument | null> {
    return Vehicle.findByIdAndUpdate(
      id,
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [lng, lat], // ⚠️ MongoDB GeoJSON: [Longitude, Latitude]
            lastUpdated: new Date(),
          },
          heading: heading,
        },
      },
      { new: true },
    ).exec();
  }
}
