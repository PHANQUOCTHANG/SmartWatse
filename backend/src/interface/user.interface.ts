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
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  areaId?: number;
  status: UserStatus;
  createdAt: Date;
}
