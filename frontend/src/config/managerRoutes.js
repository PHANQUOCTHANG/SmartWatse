
import {
  Map,
  Calendar,
  ClipboardList,
  BarChart2,
  MessageSquare,
  FileText,
} from "lucide-react";

export const managerRoutes = [
  {
    path: "/manager/map",
    label: "Giám sát bản đồ",
    breadcrumb: "Bản đồ",
    title: "Giám sát vận hành",
    icon: Map,
    search: {
      placeholder: "Tìm địa điểm, mã thùng...",
      show: true,
    },
  },
  {
    path: "/manager/schedule",
    label: "Lịch thu gom",
    breadcrumb: "Lịch thu gom",
    title: "Lịch Thu Gom",
    icon: Calendar,
    search: {
      placeholder: "Tìm kiếm nhiệm vụ...",
      show: true,
    },
  },
  {
    path: "/manager/tasks",
    label: "Phân công nhiệm vụ",
    breadcrumb: "Phân công",
    title: "Quản lý nhiệm vụ",
    icon: ClipboardList,
    search: {
      placeholder: "Tìm nhiệm vụ, người thực hiện...",
      show: false,
    },
  },
  {
    path: "/manager/progress",
    label: "Theo dõi tiến độ",
    breadcrumb: "Tiến độ",
    title: "Theo dõi thu gom",
    icon: BarChart2,
    search: {
      placeholder: "Tìm tuyến, trạng thái thu gom...",
      show: true,
    },
  },
  {
    path: "/manager/feedback",
    label: "Quản lý phản hồi",
    breadcrumb: "Phản hồi",
    title: "Quản lý phản hồi",
    icon: MessageSquare,
    search: {
      placeholder: "Tìm phản ánh, người gửi...",
      show: false,
    },
  },
  {
    path: "/manager/reports",
    label: "Báo cáo & Thống kê",
    breadcrumb: "Báo cáo",
    title: "Báo cáo & thống kê",
    icon: FileText,
    search: {
      placeholder: "Tìm báo cáo, khoảng thời gian...",
      show: false,
    },
  },
];
