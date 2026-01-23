import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { Shift, IShiftDocument } from "@/models/shift.model";
import { ShiftFilter, IShift, ShiftStatus } from "@/interface/shift.interface";

export interface IShiftRepository {
  create(data: Partial<IShift>): Promise<IShiftDocument>;
  findById(id: string): Promise<IShiftDocument | null>;
  findActiveShift(staffId: string): Promise<IShiftDocument | null>;
  updateById(id: string, data: Partial<IShift>): Promise<IShiftDocument | null>;
  findAll(
    query: BaseQuery<ShiftFilter>,
  ): Promise<IPaginatedResult<IShiftDocument>>;
}

export class ShiftRepository implements IShiftRepository {
  async create(data: Partial<IShift>) {
    return Shift.create(data);
  }

  async findById(id: string) {
    return Shift.findById(id)
      .populate("staffId", "fullName email avatar") // Lấy thêm avatar nếu cần
      .populate("vehicleId", "code licensePlate brand status") // Lấy chi tiết xe
      .exec();
  }

  async findActiveShift(staffId: string) {
    return Shift.findOne({
      staffId,
      status: ShiftStatus.ON_DUTY,
    })
      .populate("vehicleId", "code licensePlate")
      .exec();
  }

  async updateById(id: string, data: Partial<IShift>) {
    return Shift.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async findAll(
    query: BaseQuery<ShiftFilter>,
  ): Promise<IPaginatedResult<IShiftDocument>> {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      filter: shiftFilter = {},
    } = query;

    const filter: any = { ...shiftFilter };

    // Tìm kiếm theo ngày (Range)
    if (shiftFilter.startDate && shiftFilter.endDate) {
      filter.startTime = {
        $gte: new Date(shiftFilter.startDate),
        $lte: new Date(shiftFilter.endDate),
      };
      delete filter.startDate;
      delete filter.endDate;
    }

    const [data, total] = await Promise.all([
      Shift.find(filter)
        .populate("staffId", "fullName")
        .populate("vehicleId", "code licensePlate")
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Shift.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
