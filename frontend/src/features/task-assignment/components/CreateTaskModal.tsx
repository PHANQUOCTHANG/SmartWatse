import { X, Search } from "lucide-react";
import React, { useState } from "react";
import { useTaskAssignmentForm } from "../hooks/useTaskAssignmentForm";
import { useTasks } from "../hooks/useTasks";
import { createTaskSchema } from "../schemas/task-assignment.schema";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  // Lấy tất cả logic form từ hook
  const {
    formData,
    setFormData,
    staffSearch,
    setStaffSearch,
    showStaffDropdown,
    setShowStaffDropdown,
    staffDropdownRef,
    setStaffDropdownRef,
    schedules,
    vehicles,
    filteredStaff,
    selectedStaffObjects,
    loadingSchedules,
    loadingVehicles,
    loadingStaff,
    loadResources,
    handleAddStaff,
    handleRemoveStaff,
  } = useTaskAssignmentForm();

  // Hook tạo task
  const { createMutation } = useTasks();

  // State quản lý lỗi validation
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Tải dữ liệu khi modal mở
  React.useEffect(() => {
    if (isOpen) {
      loadResources();
      setShowStaffDropdown(true);
      setValidationErrors({});
    }
  }, [isOpen, loadResources, setShowStaffDropdown]);

  // Xử lý gửi form với validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form data
    const result = createTaskSchema.safeParse(formData);
    console.log("Validation result:", result);

    if (!result.success) {
      // Chuyển lỗi zod thành object
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      console.error("Validation errors:", errors);
      setValidationErrors(errors);
      toast.error("❌ Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    console.log("Form data valid, submitting:", result.data);

    // Gửi request tạo task
    createMutation.mutate(result.data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex"
      style={{ left: "var(--sidebar-width, 255px)" }}
    >
      {/* Content mờ */}
      <div className="flex-1 backdrop-blur-sm bg-black/10 pointer-events-none"></div>

      {/* Modal form */}
      <div className="w-1/2 bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Tạo Nhiệm vụ Mới
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Phân công vị trí là đơn tiếp thu gom rác thải
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 flex-1 overflow-y-auto"
        >
          {/* LỊCH TRÌNH HỆ THỐNG */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
              ● LỊCH TRÌNH HỆ THỐNG
            </label>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-gray-600 font-medium">
                  Chọn lịch trình đề sáng
                </label>
                {validationErrors.scheduleId && (
                  <span className="text-xs text-red-500 font-medium">
                    {validationErrors.scheduleId}
                  </span>
                )}
              </div>
              <select
                value={formData.scheduleId}
                onChange={(e) =>
                  setFormData({ ...formData, scheduleId: e.target.value })
                }
                disabled={loadingSchedules || schedules.length === 0}
                className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  validationErrors.scheduleId
                    ? "border border-red-300"
                    : "border border-gray-300"
                }`}
              >
                <option value="">
                  {loadingSchedules ? "Đang tải..." : "-- Chọn lịch trình --"}
                </option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id || ""}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PHÂN CÔNG NGUỒN LỰC */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
              👥 PHÂN CÔNG NGUỒN LỰC
            </label>

            {/* Staff Multi-Select */}
            <div className="mb-3" ref={setStaffDropdownRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-gray-600 font-medium">
                  Nhân viên thu gom (Staff) - Chọn nhiều người
                </label>
                {validationErrors.staffIds && (
                  <span className="text-xs text-red-500 font-medium">
                    {validationErrors.staffIds}
                  </span>
                )}
              </div>
              <div className="relative">
                <div
                  className={`border rounded-lg bg-white overflow-visible ${
                    validationErrors.staffIds
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  {/* Input tìm kiếm nhân viên */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder={
                        loadingStaff
                          ? "Đang tải nhân viên..."
                          : "Tìm theo tên hoặc mã nhân viên"
                      }
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      onFocus={() => setShowStaffDropdown(true)}
                      disabled={loadingStaff}
                      className="flex-1 text-xs outline-none bg-transparent disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Hiển thị nhân viên đã chọn */}
                  {selectedStaffObjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
                      {selectedStaffObjects.map((staff) => (
                        <button
                          key={staff.id}
                          type="button"
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {staff.name}
                          <X size={12} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Danh sách dropdown nhân viên */}
                  {showStaffDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 max-h-48 overflow-y-auto bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-lg">
                      {loadingStaff ? (
                        <div className="px-3 py-6 text-center text-gray-500 text-xs">
                          Đang tải danh sách nhân viên...
                        </div>
                      ) : filteredStaff.length > 0 ? (
                        filteredStaff.map((staff) => (
                          <label
                            key={staff.id}
                            className={`flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-blue-50 transition cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              formData.staffIds.includes(staff.id)
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.staffIds.includes(staff.id)}
                              onChange={() => handleAddStaff(staff.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            <div className="flex-1">
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-gray-500 text-xs">
                                {staff.status}
                              </div>
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="px-3 py-6 text-center text-gray-500 text-xs">
                          Không tìm thấy nhân viên phù hợp
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chọn xe ôp tác */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-gray-600 font-medium">
                  Xe ôp tác (Vehicle)
                </label>
                {validationErrors.vehicleId && (
                  <span className="text-xs text-red-500 font-medium">
                    {validationErrors.vehicleId}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white ${
                  validationErrors.vehicleId
                    ? "border border-red-300"
                    : "border border-gray-300"
                }`}
              >
                <span className="text-sm">🚚</span>
                <select
                  value={formData.vehicleId}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleId: e.target.value })
                  }
                  disabled={loadingVehicles || vehicles.length === 0}
                  className="flex-1 text-sm outline-none bg-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingVehicles ? "Đang tải..." : "-- Chọn xe --"}
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id || ""}>
                      {vehicle.plateNumber || `Vehicle ${vehicle.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* GHI CHÚ NHIỆM VỤ */}
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-2 tracking-wide">
              📝 Ghi chú nhiệm vụ
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Nhập các lưu ý bắt buộc điều chỉnh nhân viên (ví tí khôa cửa, yêu cầu đơn dọp ký...)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Đang xử lý...
                </>
              ) : (
                <>✔ Tạo và Giao nhiệm vụ</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="px-4 py-2.5 text-gray-700 text-sm font-medium hover:text-gray-900 transition disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
