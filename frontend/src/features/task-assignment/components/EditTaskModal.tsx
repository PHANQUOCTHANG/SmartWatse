import { X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useTaskAssignmentForm } from "../hooks/useTaskAssignmentForm";
import { useTasks } from "../hooks/useTasks";
import { taskAssignmentApi } from "../api/taskApi";
import { createTaskSchema } from "../schemas/task-assignment.schema";
import { toast } from "sonner";

interface EditTaskModalProps {
  taskId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTaskModal({
  taskId,
  isOpen,
  onClose,
}: EditTaskModalProps) {
  const {
    formData,
    setFormData,
    staffSearch,
    setStaffSearch,
    showStaffDropdown,
    setShowStaffDropdown,
    schedules,
    vehicles,
    filteredStaff,
    selectedStaffObjects,
    loadingSchedules,
    loadingVehicles,
    loadResources,
    handleAddStaff,
    handleRemoveStaff,
  } = useTaskAssignmentForm();

  const { updateMutation } = useTasks();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  const [taskStaffs, setTaskStaffs] = useState<any[]>([]);

  const loadTaskData = useCallback(async () => {
    if (!taskId) return;
    try {
      setIsLoadingTask(true);
      const task = await taskAssignmentApi.getById(taskId);

      console.log("Loaded task:", task);

      // Map task data to form data
      const scheduleId =
        task.scheduleId || task.schedule?._id || task.schedule?.id || "";
      const staffIds = task.staffIds || [];
      const vehicleId =
        task.vehicleId || task.vehicle?._id || task.vehicle?.id || "";
      const note = task.note || "";

      setFormData({
        scheduleId,
        staffIds,
        vehicleId,
        note,
      });

      // Store task staffs to sync later
      setTaskStaffs(task.staffs || []);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu task");
      console.error(error);
    } finally {
      setIsLoadingTask(false);
    }
  }, [taskId, setFormData]);

  // Load task data khi modal mở
  useEffect(() => {
    if (isOpen && taskId) {
      loadResources();
      loadTaskData();
      setValidationErrors({});
    }
  }, [isOpen, taskId, loadResources, loadTaskData]);

  // Sync task staffs to selected staff objects after loading
  useEffect(() => {
    if (!isLoadingTask && taskStaffs.length > 0) {
      taskStaffs.forEach((staff: any) => {
        const staffId = staff._id || staff.id;
        if (staffId && !selectedStaffObjects.find((s) => s.id === staffId)) {
          handleAddStaff(staffId);
        }
      });
    }
  }, [isLoadingTask, taskStaffs, selectedStaffObjects, handleAddStaff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form data
    const result = createTaskSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      setValidationErrors(errors);
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Remove empty strings from payload
    const payload = {
      scheduleId: result.data.scheduleId || undefined,
      vehicleId: result.data.vehicleId || undefined,
      staffIds: result.data.staffIds,
      note: result.data.note || undefined,
    };

    console.log("Submitting payload:", payload);

    // Gửi request cập nhật task
    updateMutation.mutate(
      {
        id: taskId!,
        payload,
      },
      {
        onSuccess: () => {
          console.log("Task updated successfully");
          toast.success("Cập nhật nhiệm vụ thành công");
          onClose();
        },
        onError: (error: any) => {
          console.error("Update failed:", error);
          toast.error(error?.message || "Cập nhật nhiệm vụ thất bại");
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex"
      style={{ left: "var(--sidebar-width, 255px)" }}
    >
      {/* Content mờ */}
      <div
        className="flex-1 backdrop-blur-sm bg-black/10 pointer-events-none"
        onClick={onClose}
      ></div>

      {/* Modal form */}
      <div className="w-1/2 bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Sửa Nhiệm vụ
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Chỉnh sửa thông tin phân công gom rác thải
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
          {isLoadingTask ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* LỊCH TRÌNH HỆ THỐNG */}
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
                  ● LỊCH TRÌNH HỆ THỐNG
                </label>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-gray-600 font-medium">
                      Chọn lịch trình
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
                    className="w-full px-3 py-2 border rounded-lg bg-white disabled:opacity-50 cursor-pointer text-xs"
                  >
                    <option value="">-- Chọn lịch trình --</option>
                    {schedules.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PHƯƠNG TIỆN */}
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
                  ● PHƯƠNG TIỆN
                </label>
                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-2">
                    Chọn phương tiện (tùy chọn)
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                    disabled={loadingVehicles}
                    className="w-full px-3 py-2 border rounded-lg bg-white disabled:opacity-50 cursor-pointer text-xs"
                  >
                    <option value="">-- Không chọn phương tiện --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plateNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NHÂN VIÊN */}
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
                  ● NHÂN VIÊN
                </label>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-gray-600 font-medium">
                      Chọn nhân viên thực hiện công việc
                    </label>
                    {validationErrors.staffIds && (
                      <span className="text-xs text-red-500 font-medium">
                        {validationErrors.staffIds}
                      </span>
                    )}
                  </div>

                  <div className="relative mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tìm kiếm nhân viên..."
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                        onFocus={() => setShowStaffDropdown(true)}
                        className="flex-1 px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>

                    {showStaffDropdown && filteredStaff.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredStaff.map((staff) => (
                          <button
                            key={staff.id}
                            type="button"
                            onClick={() => {
                              handleAddStaff(staff.id);
                              setStaffSearch("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-xs"
                          >
                            {staff.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Staff */}
                  <div className="flex flex-wrap gap-2">
                    {selectedStaffObjects.map((staff) => (
                      <span
                        key={staff.id}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                      >
                        {staff.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="text-blue-700 hover:text-blue-900 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* GHI CHÚ */}
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-3 tracking-wide">
                  ● GHI CHÚ
                </label>
                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-2">
                    Ghi chú thêm về nhiệm vụ
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg resize-none text-xs"
                    rows={3}
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || isLoadingTask}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
