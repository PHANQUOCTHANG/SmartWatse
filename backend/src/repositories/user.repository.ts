import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { IUser } from "@/interface/user.interface";
import { IUserDocument, User } from "@/models/user.model";

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUserDocument>;
  findByEmail(
    email: string,
    includePassword?: boolean
  ): Promise<IUserDocument | null>;
  findById(id: string): Promise<IUserDocument | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUserDocument | null>;
  updateByEmail(
    email: string,
    data: Partial<IUser>
  ): Promise<IUserDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<IUserDocument>>;
}

export class UserRepository implements IUserRepository {
  // Tạo user mới
  async create(data: Partial<IUser>): Promise<IUserDocument> {
    return User.create(data);
  }

  // Tìm user theo email (Có option lấy kèm passwordHash để login)
  async findByEmail(
    email: string,
    includePassword = false
  ): Promise<IUserDocument | null> {
    const query = User.findOne({ email });
    if (includePassword) query.select("+passwordHash");
    return query.exec();
  }

  // Tìm user theo id
  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id).exec();
  }

  // Cập nhật user theo id
  async updateById(
    id: string,
    data: Partial<IUser>
  ): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  // Cập nhật user theo email (Dùng cho logic Reset Password)
  async updateByEmail(
    email: string,
    data: Partial<IUser>
  ): Promise<IUserDocument | null> {
    return User.findOneAndUpdate(
      { email },
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  // Xoá user
  async deleteById(id: string): Promise<void> {
    await User.findByIdAndDelete(id).exec();
  }

  // Lấy danh sách user có phân trang + search + sort
  async findAll(query: BaseQuery): Promise<IPaginatedResult<IUserDocument>> {
    const { page = 1, limit = 10, search, sort = "-createdAt" } = query;

    // Tìm kiếm theo fullName hoặc email
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      User.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
