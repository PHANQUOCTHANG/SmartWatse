import { UserRole, UserStatus } from "../../interface/user.interface";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  areaId?: number;
  status: UserStatus;
  createdAt: Date;
}
