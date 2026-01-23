import { BaseQuery, FilterBuilder } from "@/interface/query.interface";

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

  phoneNumber?: string;

  address?: string;
  avatar?: string;

  areaId?: string;

  status: UserStatus;
  createdAt: Date;
}
export interface UserFilter {
  role?: UserRole;
  status?: UserStatus;
  areaId?: string;
}

export class UserFilterBuilder implements FilterBuilder<UserFilter> {
  build(query: any): UserFilter {
    const filter: UserFilter = {};

    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.areaId) filter.areaId = query.areaId;

    return filter;
  }
}
