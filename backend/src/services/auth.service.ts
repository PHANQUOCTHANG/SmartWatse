import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "@/utils/appError";
import { IUserRepository } from "@/repositories/user.repository";
import { IRefreshTokenRepository } from "@/repositories/refreshToken.repository";
import { IOtpRepository } from "@/repositories/otp.repository";
import { UserRole, UserStatus } from "@/interface/user.interface";
import {
  LoginRequestDto,
  RegisterRequestDto,
} from "@/dto/request/auth.request";

// Kết quả xác thực trả về cho tầng Controller
interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface IAuthService {
  register(dto: RegisterRequestDto): Promise<AuthResult>;
  login(dto: LoginRequestDto): Promise<AuthResult>;
  refresh(refreshToken: string): Promise<AuthResult>;
  logout(refreshToken: string): Promise<void>;
  resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly otpRepo: IOtpRepository
  ) {}

  // Đăng ký tài khoản mới và tự động đăng nhập
  async register(dto: RegisterRequestDto): Promise<AuthResult> {
    // Kiểm tra sự tồn tại của email thông qua UserRepository
    const existed = await this.userRepo.findByEmail(dto.email);
    if (existed) throw new AppError("Email đã tồn tại trên hệ thống", 409);

    // Băm mật khẩu bảo mật trước khi lưu trữ
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Khởi tạo người dùng với vai trò mặc định là CITIZEN và trạng thái ACTIVE
    const user = await this.userRepo.create({
      ...dto,
      passwordHash,
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
    });

    return this.generateAuthResult(user);
  }

  // Xác thực đăng nhập bằng email và mật khẩu
  async login(dto: LoginRequestDto): Promise<AuthResult> {
    // Tìm kiếm user và yêu cầu lấy kèm passwordHash (đã bị ẩn ở Schema)
    const user = await this.userRepo.findByEmail(dto.email, true);

    if (!user || !user.passwordHash) {
      throw new AppError("Email hoặc mật khẩu không chính xác", 401);
    }

    // So sánh mật khẩu thô với mã băm trong Database
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid)
      throw new AppError("Email hoặc mật khẩu không chính xác", 401);

    // Kiểm tra trạng thái tài khoản trước khi cho phép truy cập
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError("Tài khoản của bạn hiện đang bị khóa", 403);
    }

    return this.generateAuthResult(user);
  }

  // Cấp mới Access Token khi hết hạn (Token Rotation)
  async refresh(refreshToken: string): Promise<AuthResult> {
    if (!refreshToken)
      throw new AppError("Vui lòng cung cấp Refresh Token", 401);

    // Kiểm tra tính hợp lệ của Refresh Token trong Database
    const stored = await this.refreshRepo.findValid(refreshToken);
    if (!stored) {
      throw new AppError(
        "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại",
        401
      );
    }

    const user = await this.userRepo.findById(stored.userId.toString());
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    // Thu hồi (Revoke) token cũ để đảm bảo an toàn
    await this.refreshRepo.revoke(refreshToken);

    return this.generateAuthResult(user);
  }

  // Đăng xuất và hủy bỏ Refresh Token hiện tại
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    await this.refreshRepo.revoke(refreshToken);
  }

  // Đặt lại mật khẩu sau khi đã xác thực OTP thành công
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> {
    const record = await this.otpRepo.findValidByEmail(email);
    if (!record || !record.verified) {
      throw new AppError("Mã OTP không hợp lệ hoặc chưa được xác thực", 400);
    }

    // Cập nhật mật khẩu mới cho người dùng
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Sử dụng hàm updateByEmail từ UserRepository đã viết trước đó
    const user = await this.userRepo.updateByEmail(email, { passwordHash });
    if (!user) throw new AppError("Không tìm thấy người dùng", 404);

    // Bảo mật: Đăng xuất tất cả các thiết bị sau khi đổi mật khẩu
    await this.refreshRepo.revokeAllByUser(user.id);

    // Dọn dẹp OTP sau khi sử dụng thành công
    await this.otpRepo.deleteByEmail(email);
  }

  // Hàm nội bộ để tạo bộ đôi Token và lưu trữ phiên làm việc
  private async generateAuthResult(user: any): Promise<AuthResult> {
    const accessSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new AppError("Lỗi cấu hình hệ thống: JWT Secret", 500);
    }

    // Tạo Access Token (Ngắn hạn - 15 phút)
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      accessSecret,
      { expiresIn: "15m" }
    );

    // Tạo Refresh Token (Dài hạn - 7 ngày)
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, {
      expiresIn: "7d",
    });

    // Lưu phiên làm việc vào cơ sở dữ liệu
    await this.refreshRepo.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
