import { UserModel, IUserDocument } from "../models/user.model";
import { IUser } from "../interface/user.interface";

export interface IUserRepository {
  // Tạo người dùng mới
  create(data: Partial<IUser>): Promise<IUserDocument>;
  // Lấy danh sách tất cả người dùng
  findAll(): Promise<IUserDocument[]>;
  // Tìm người dùng theo ID
  findById(id: string): Promise<IUserDocument | null>;
  // Tìm người dùng theo Email
  findByEmail(email: string): Promise<IUserDocument | null>;
  // Cập nhật thông tin người dùng
  update(id: string, data: Partial<IUser>): Promise<IUserDocument | null>;
  // Xóa người dùng khỏi hệ thống
  delete(id: string): Promise<IUserDocument | null>;
}

export class UserRepository implements IUserRepository {
  async create(data: Partial<IUser>) {
    return await UserModel.create(data);
  }
  async findAll() {
    return await UserModel.find().sort({ created_at: -1 });
  }
  async findById(id: string) {
    return await UserModel.findById(id).exec();
  }
  async findByEmail(email: string) {
    return await UserModel.findOne({ email }).exec();
  }
  async update(id: string, data: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }
  async delete(id: string) {
    return await UserModel.findByIdAndDelete(id).exec();
  }
}
