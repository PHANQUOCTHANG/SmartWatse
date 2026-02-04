// 1. User Entity (Khớp với Model Mongo & Response API)
export type UserRole = "ADMIN" | "MANAGER" | "STAFF" | "CITIZEN";

export interface IUser {
  id: string;
  fullName: string;
  username?: string; // Có thể optional nếu dùng email làm chính
  email: string;
  role: UserRole;
  status?: string;

  // Thông tin cá nhân & liên lạc
  avatar?: string;
  phoneNumber?: string;
  address?: string;

  // Trạng thái tài khoản
  isActive: boolean;
  isVerified: boolean;
  mustChangePassword: boolean; // True nếu là acc nhân viên mới tạo

  // Metadata
  authProvider?: "local" | "google";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// User Profile (Thường dùng cho trang "Thông tin cá nhân")
export interface UserProfile extends IUser {
  // Các trường thống kê cá nhân (nếu có)
  totalReportsSubmitted?: number; // Số báo cáo sự cố đã gửi
  assignedTasksCount?: number; // Số nhiệm vụ được giao (cho STAFF)
}

// 2. DTOs (Data Transfer Objects - Gửi lên Server)

// Create User Request Payload
export interface CreateUserDTO {
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  avatar?: File | null;
}

// Update User Request Payload
export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  role?: UserRole;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  isVerified?: boolean;
  password?: string;
  avatar?: File | null | string; // File mới hoặc URL cũ
}

// 3. Client Filter Params (Cho trang danh sách User)
export interface UserFilterParams {
  page?: number;
  limit?: number;
  keyword?: string; // Tìm theo tên, email, sđt
  role?: UserRole;
  status?: "ACTIVE" | "INACTIVE";
}

// 4. Staff Specific (Nếu cần quản lý kỹ hơn về nhân viên)
// Thay thế cho ArtistRequest cũ
export interface StaffProfile {
  userId: string;
  employeeCode: string; // Mã nhân viên (VD: EMP-001)
  department: "COLLECTION" | "MAINTENANCE" | "IT"; // Bộ phận
  assignedAreaId?: string; // ID khu vực phụ trách (Quận/Phường)
  licensePlate?: string; // Biển số xe (nếu là tài xế)
  status: "ON_DUTY" | "OFF_DUTY" | "LEAVE";
}
