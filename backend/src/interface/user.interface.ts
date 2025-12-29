export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CITIZEN = "CITIZEN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUser {
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone?: string;
  area_id?: number;
  status: UserStatus;
  created_at: Date;
}
