// 1. Enums (Định nghĩa các giá trị cố định)
export enum UserRole {
  ADMIN = "ADMIN", // Quản trị viên hệ thống
  MANAGER = "MANAGER", // Quản lý khu vực
  STAFF = "STAFF", // Nhân viên thu gom
  CITIZEN = "CITIZEN", // Người dân
}

export enum UserStatus {
  ACTIVE = "ACTIVE", // Đang hoạt động
  INACTIVE = "INACTIVE", // Đã bị khóa
}

// 2. Main Interface (Dữ liệu hiển thị trên UI)
export interface IUser {
  id: string; // ID từ MongoDB (_id đã được convert sang string)
  fullName: string;
  email: string;
  role: UserRole;

  // Các trường Optional (Có thể null hoặc undefined từ BE)
  phoneNumber?: string;
  address?: string;
  avatar?: string; // URL ảnh (Cloudinary/S3 hoặc local path)

  // Area có thể là ID (string) hoặc Object (nếu populate)
  // Trong bảng User list thường chỉ cần string hoặc tên khu vực
  areaId?: string;
  areaName?: string;

  status: UserStatus;

  createdAt: string; // Date string (ISO 8601)
  updatedAt?: string;
}

// 3. Helper Types (Dùng cho Props hoặc xử lý logic)

// Dùng cho Table Column hoặc Badge color mapping
export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Quản trị viên",
  [UserRole.MANAGER]: "Quản lý",
  [UserRole.STAFF]: "Nhân viên",
  [UserRole.CITIZEN]: "Cư dân",
};

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Hoạt động",
  [UserStatus.INACTIVE]: "Vô hiệu hóa",
};

// Type cho Filter/Search Params trên URL
export interface UserFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  areaId?: string;
  sort?: string; // vd: "-createdAt"
}
