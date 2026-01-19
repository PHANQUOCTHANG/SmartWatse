import bcrypt from "bcrypt";
import { IUserRepository } from "../repositories/user.repository";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/dto/request/user.request";
import { UserResponse } from "@/dto/response/user.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { IUser, UserRole, UserStatus } from "@/interface/user.interface";
import AppError from "../utils/appError";
import { IUserDocument } from "@/models/user.model";

export interface IUserService {
  create(dto: CreateUserRequest): Promise<UserResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<UserResponse>>;
  findById(id: string): Promise<UserResponse>;
  update(id: string, dto: UpdateUserRequest): Promise<UserResponse>;
  delete(id: string): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  // Xử lý đăng ký tài khoản mới, bao gồm kiểm tra trùng lặp email và mã hóa bảo mật mật khẩu
  async create(dto: CreateUserRequest): Promise<UserResponse> {
    const { password, ...rest } = dto;

    // Ngăn chặn tạo tài khoản nếu địa chỉ email đã tồn tại trong hệ thống
    const existed = await this.userRepository.findByEmail(dto.email);
    if (existed) throw new AppError("Email đã tồn tại trên hệ thống", 400);

    // Sử dụng Bcrypt để băm mật khẩu thô trước khi lưu trữ vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userRepository.create({
      ...rest,
      passwordHash,
      role: dto.role || UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
    });

    return this.mapToResponse(user);
  }

  // Truy vấn và phân trang danh sách người dùng dựa trên bộ lọc từ yêu cầu của Client
  async findAll(query: BaseQuery): Promise<IPaginatedResult<UserResponse>> {
    const result = await this.userRepository.findAll(query);

    // Chuyển đổi danh sách Document sang định dạng Response DTO để trả ra ngoài tầng ứng dụng
    return {
      ...result,
      data: result.data.map((user) => this.mapToResponse(user)),
    };
  }

  // Truy xuất thông tin chi tiết một tài khoản và xác thực sự tồn tại của dữ liệu
  async findById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    // Đảm bảo trả về lỗi rõ ràng nếu không tìm thấy ID người dùng tương ứng
    if (!user) throw new AppError("Không tìm thấy người dùng", 404);

    return this.mapToResponse(user);
  }

  // Cập nhật các thông tin định danh hoặc trạng thái hoạt động của người dùng
  async update(id: string, dto: UpdateUserRequest): Promise<UserResponse> {
    const updateData: Partial<IUser> = { ...dto };
    const user = await this.userRepository.updateById(id, updateData);

    // Kiểm tra tính hợp lệ của thực thể trước khi thực hiện thao tác sửa đổi dữ liệu
    if (!user)
      throw new AppError(
        "Người dùng không tồn tại hoặc cập nhật thất bại",
        404,
      );

    return this.mapToResponse(user);
  }

  // Xử lý nghiệp vụ xóa bỏ tài khoản sau khi đã xác thực người dùng có tồn tại
  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    // Chỉ cho phép xóa khi tài khoản thực sự tồn tại để tránh lỗi hệ thống
    if (!user) throw new AppError("Người dùng không tồn tại để xóa", 404);

    await this.userRepository.deleteById(id);
  }

  // Chuẩn hóa dữ liệu trả về cho Client, đảm bảo không rò rỉ các thông tin nhạy cảm như passwordHash
  private mapToResponse(user: IUserDocument): UserResponse {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}
