import { UserRole, UserStatus } from "../../interface/user.interface";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;

  phoneNumber?: string;
  address?: string;
  avatar?: string;
  areaName?: string;
  areaId?: string;

  status: UserStatus;
  createdAt: Date;
}
