import { BaseQuery, normalizeQuery } from "@/interface/query.interface";

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

export interface QueryUser extends BaseQuery {
  role?: UserRole;
  areaId?: number;
  status?: UserStatus;
}

export const normalizeQueryUser = (query: any): QueryUser => ({
  ...normalizeQuery(query),
  role: query.role ? (query.role as UserRole) : undefined,
  areaId: query.areaId ? Number(query.areaId) : undefined,
  status: query.status ? (query.status as UserStatus) : undefined,
});
