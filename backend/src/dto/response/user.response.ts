import { UserRole, UserStatus } from "../../interface/user.interface";

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  area_id?: number;
  status: UserStatus;
  created_at: Date;
}
