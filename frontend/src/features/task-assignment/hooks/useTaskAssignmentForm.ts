import { useState } from "react";
import React from "react";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";
import { vehicleApi } from "@/features/vehicles/api/vehicleApi";
import { userApi } from "@/features/user/api/userApi";
import { ISchedule } from "@/features/schedule/types";
import { IVehicle } from "@/features/vehicles/types";
import { IUser } from "@/features/user/types";

export interface Staff {
  id: string;
  name: string;
  status: string;
}

export interface TaskAssignmentFormData {
  scheduleId: string;
  staffIds: string[];
  vehicleId: string;
  note: string;
}

export const useTaskAssignmentForm = () => {
  // Dữ liệu form chính
  const [formData, setFormData] = useState<TaskAssignmentFormData>({
    scheduleId: "",
    staffIds: [],
    vehicleId: "",
    note: "",
  });

  // Trạng thái dropdown nhân viên
  const [staffSearch, setStaffSearch] = useState("");
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [staffDropdownRef, setStaffDropdownRef] =
    useState<HTMLDivElement | null>(null);

  // Dữ liệu từ API
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Trạng thái loading cho từng dữ liệu
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Đóng dropdown khi click bên ngoài
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        staffDropdownRef &&
        !staffDropdownRef.contains(event.target as Node)
      ) {
        setShowStaffDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [staffDropdownRef]);

  // Fetch schedules
  const fetchSchedules = React.useCallback(async () => {
    setLoadingSchedules(true);
    try {
      // Lấy ngày hiện tại địa phương định dạng YYYY-MM-DD
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

      console.log("Fetching schedules for today:", today);

      const result = await scheduleApi.getAll({ page: 1, limit: 100 , startDate: today});
      setSchedules(result.data || []);
      // // Tự động chọn lịch trình đầu tiên
      // if (result.data && result.data.length > 0) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     scheduleId: result.data[0].id || "",
      //   }));
      // }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoadingSchedules(false);
    }
  }, []);

  // Fetch vehicles
  const fetchVehicles = React.useCallback(async () => {
    setLoadingVehicles(true);
    try {
      const result = await vehicleApi.getAll({ page: 1, limit: 100 });
      setVehicles(result.data || []);
      // // Tự động chọn xe đầu tiên
      // if (result.data && result.data.length > 0) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     vehicleId: result.data[0].id || "",
      //   }));
      // }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoadingVehicles(false);
    }
  }, []);

  // Fetch nhân viên có role STAFF
  const fetchStaff = React.useCallback(async () => {
    setLoadingStaff(true);
    try {
      const result = await userApi.getAll({
        role: "STAFF",
        status: "ACTIVE",
      });

      console.log("Raw STAFF users:", result.data);

      // Chuyển đổi từ IUser sang Staff
      const mappedStaff: Staff[] = (result.data || []).map((user: IUser) => ({
        id: user.id,
        name: user.fullName,
        status: user.status === "ACTIVE" ? "Sẵn sàng" : "Không hoạt động",
      }));

      console.log("Fetched STAFF users:", mappedStaff);
      setStaffList(mappedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  // Tải tất cả dữ liệu (lịch trình, xe, nhân viên)
  const loadResources = React.useCallback(async () => {
    await Promise.all([fetchSchedules(), fetchVehicles(), fetchStaff()]);
  }, [fetchSchedules, fetchVehicles, fetchStaff]);

  // Lọc nhân viên theo tìm kiếm, loại trừ những người đã chọn
  const filteredStaff = staffList.filter((staff) => {
    const searchLower = staffSearch.toLowerCase();
    const matchesSearch =
      staff.name.toLowerCase().includes(searchLower) ||
      staff.id.toLowerCase().includes(searchLower);
    const notSelected = !formData.staffIds.includes(staff.id);
    return matchesSearch && notSelected;
  });

  // Lấy danh sách nhân viên được chọn
  const selectedStaffObjects = staffList.filter((staff) =>
    formData.staffIds.includes(staff.id),
  );

  // Thêm/bỏ nhân viên khỏi danh sách chọn
  const handleAddStaff = (staffId: string) => {
    setFormData({
      ...formData,
      staffIds: formData.staffIds.includes(staffId)
        ? formData.staffIds.filter((id) => id !== staffId)
        : [...formData.staffIds, staffId],
    });
  };

  // Xóa nhân viên khỏi danh sách chọn
  const handleRemoveStaff = (staffId: string) => {
    setFormData({
      ...formData,
      staffIds: formData.staffIds.filter((id) => id !== staffId),
    });
  };

  // Đặt lại form về trạng thái ban đầu
  const handleResetForm = () => {
    setFormData({
      scheduleId: schedules[0]?.id || "",
      staffIds: staffList[0] ? [staffList[0].id] : [],
      vehicleId: vehicles[0]?.id || "",
      note: "",
    });
    setStaffSearch("");
    setShowStaffDropdown(false);
  };

  return {
    // Form data
    formData,
    setFormData,

    // Dropdown states
    staffSearch,
    setStaffSearch,
    showStaffDropdown,
    setShowStaffDropdown,
    staffDropdownRef,
    setStaffDropdownRef,

    // Data
    schedules,
    vehicles,
    staffList,
    filteredStaff,
    selectedStaffObjects,

    // Loading states
    loadingSchedules,
    loadingVehicles,
    loadingStaff,

    // Methods
    loadResources,
    handleAddStaff,
    handleRemoveStaff,
    handleResetForm,
  };
};
