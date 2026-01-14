import { useState, useMemo } from "react";
import { TaskBin } from "../types/task-detail.type";

// Giả sử đây là dữ liệu gốc từ API
const MOCK_TASKS = [
  { id: "TASK-2023-001", title: "Chợ Bến Thành (Cửa Nam)", address: "Đ. Lê Lợi, Quận 1", status: "OVERLOADED", timeAgo: "15 phút trước", lat: 10.7719, lng: 106.6983 },
  { id: "TASK-2023-005", title: "Công viên 23/9 (Khu B)", address: "Đ. Phạm Ngũ Lão, Q.1", status: "FULL", timeAgo: "1 giờ trước", lat: 10.7692, lng: 106.6948 },
  { id: "TASK-2023-008", title: "Dinh Độc Lập (Cổng sau)", address: "Đ. Nguyễn Du, Quận 1", status: "SCHEDULED", timeAgo: "2 giờ trước", lat: 10.7770, lng: 106.6953 },
  { id: "TASK-2023-010", title: "Bưu điện Trung tâm", address: "Số 2, Công xã Paris, Q.1", status: "COMPLETED", timeAgo: "Xong lúc 08:45 AM", lat: 10.7799, lng: 106.7000 },
];

export function useStaffTasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter((task) => {
      // 1. Lọc theo từ khóa tìm kiếm (Tiêu đề hoặc Địa chỉ)
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Lọc theo Tab trạng thái
      let matchesTab = true;
      if (activeTab === "Chưa hoàn thành") matchesTab = task.status !== "COMPLETED";
      if (activeTab === "Ưu tiên cao") matchesTab = task.status === "OVERLOADED";
      if (activeTab === "Đã xong") matchesTab = task.status === "COMPLETED";

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  // Tính toán số liệu cho TaskSummary
  const stats = {
    total: MOCK_TASKS.length,
    completed: MOCK_TASKS.filter(t => t.status === "COMPLETED").length,
    urgent: MOCK_TASKS.filter(t => t.status === "OVERLOADED").length,
  };

  return {
    tasks: filteredTasks,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    stats
  };
}