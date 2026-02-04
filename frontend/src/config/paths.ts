// src/config/paths.ts

// ==========================================
// 1. AUTHENTICATION (Dùng chung)
// ==========================================
export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  FORCE_CHANGE_PASSWORD: "/force-change-password",
  // Hàm tạo link động cho reset password
  RESET_PASSWORD: (token: string) => `/reset-password/${token}`,
} as const;

// ==========================================
// 2. ADMIN PATHS (Quản trị hệ thống)
// Base: /admin
// ==========================================
export const ADMIN_PATHS = {
  ROOT: "/admin",
  DASHBOARD: "", // Index route của admin

  // Quản lý người dùng & phân quyền
  USERS: "users",
  USER_DETAIL: (id: string | number) => `users/${id}`,

  // Cấu hình danh mục (Khu vực, Loại rác...)
  AREAS: "areas",
  BINS: "bins", // Quản lý thiết bị thùng rác
  COLLECTION_POINTS: "collection-points",
  VEHICLES: "vehicles", // Quản lý xe thu gom
  MAP_MONITOR: "map-monitor", // Quản lý xe thu gom

  SETTINGS: "settings",
  ANALYTICS: "analytics", // Thống kê hệ thống
} as const;

// ==========================================
// 3. MANAGER PATHS (Quản lý vận hành)
// Base: /manager
// ==========================================
export const MANAGER_PATHS = {
  ROOT: "/manager",
  DASHBOARD: "",

  // Giám sát (Quan trọng nhất)
  MAP_MONITOR: "map-monitor", // Bản đồ thời gian thực

  // Quản lý sự cố
  ALERTS: "alerts", // Cảnh báo từ cảm biến (Đầy, Hỏng)
  REPORTS: "reports", // Phản ánh từ người dân
  FEEDBACK: "feedback", // Phản hồi từ nhân viên
  SCHEDULE: "schedule", // Lịch trình thu gom
  // Điều phối
  TASKS: "tasks", // Lịch thu gom
  ROUTES: "routes", // Tối ưu lộ trình
  REPORT: "reports",
  // Báo cáo
  REPORT_STAFF: "reports/staff-performance",
  REPORT_WASTE: "reports/waste-volume",
} as const;

// ==========================================
// 4. STAFF PATHS (Nhân viên thu gom - Mobile)
// Base: /staff
// ==========================================
export const STAFF_PATHS = {
  ROOT: "/staff",
  HOME: "", // Danh sách nhiệm vụ hôm nay

  // Nhiệm vụ
  TASKS: "tasks",
  TASK_DETAIL: (id: string | number) => `tasks/${id}`,

  // Bản đồ lộ trình
  MY_ROUTE: "route",

  // Cá nhân
  HISTORY: "history",
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
} as const;

// ==========================================
// 5. CITIZEN PATHS (Người dân - Client)
// Base: / (Root)
// ==========================================
export const CITIZEN_PATHS = {
  ROOT: "/",
  HOME: "",

  // Tiện ích
  MAP_LOOKUP: "map-lookup", // Tìm thùng rác gần nhất

  // Phản ánh
  REPORT_CREATE: "report", // Gửi phản ánh mới
  MY_REPORTS: "my-reports", // Lịch sử phản ánh

  // Cá nhân
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
} as const;
