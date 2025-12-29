// src/services/user.service.ts
import { IUserRepository } from '../repositories/user.repository';
import { CreateUserRequest, UpdateUserRequest  } from '@/dto/request/user.request';
import AppError from '../utils/appError';
import { UserResponse } from '@/dto/response/user.response';

export interface IUserService {
  // Đăng ký người dùng mới và kiểm tra trùng email
  register(dto: CreateUserRequest): Promise<UserResponse>;
  // Lấy danh sách người dùng
  getList(): Promise<UserResponse[]>;
  // Lấy thông tin chi tiết một người dùng
  getDetail(id: string): Promise<UserResponse>;
  // Chỉnh sửa thông tin người dùng
  edit(id: string, dto: UpdateUserRequest): Promise<UserResponse>;
  // Xóa người dùng
  remove(id: string): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async register(dto: CreateUserRequest): Promise<UserResponse> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) throw new AppError('Email đã tồn tại', 400);
    const user = await this.userRepository.create(dto);
    return this.mapToResponse(user);
  }

  async getList(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.mapToResponse(user));
  }

  async getDetail(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Không tìm thấy người dùng', 404);
    return this.mapToResponse(user);
  }

  async edit(id: string, dto: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.update(id, dto);
    if (!user) throw new AppError('Người dùng không tồn tại', 404);
    return this.mapToResponse(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.delete(id);
    if (!user) throw new AppError('Không tìm thấy người dùng để xóa', 404);
  }

  private mapToResponse(user: any): UserResponse {
    return {
      id: user._id.toString(),
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at
    };
  }
}