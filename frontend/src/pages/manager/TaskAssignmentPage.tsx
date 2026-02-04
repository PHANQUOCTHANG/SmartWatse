import { useState } from "react";
import { Loader } from "lucide-react";
import SummaryCard from "../../features/task-assignment/components/SummaryCard";
import TaskCard from "../../features/task-assignment/components/TaskCard";
import TaskFilterBar from "../../features/task-assignment/components/TaskFilterBar";
import TaskPagination from "../../features/task-assignment/components/TaskPagination";
import CreateTaskModal from "../../features/task-assignment/components/CreateTaskModal";
import EditTaskModal from "../../features/task-assignment/components/EditTaskModal";
import DeleteConfirmModal from "../../features/task-assignment/components/DeleteConfirmModal";
import { useTasks } from "../../features/task-assignment/hooks/useTasks";
import type { TaskFilterParams } from "../../features/task-assignment/types";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner";

const TaskAssignmentPage = () => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    tasks,
    meta,
    handlePageChange,
    handleSearch,
    updateFilter,
    filterParams,
    setFilterParams,
    isLoading,
    deleteMutation,
  } = useTasks();

  const handleViewDetail = (taskId: string) => {
    setSelectedTaskId(taskId);
    console.log("Xem chi tiết task:", taskId);
    // TODO: Mở modal chi tiết task hoặc chuyển trang
  };

  const handleEdit = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleDelete = (taskId: string) => {
    setDeletingTaskId(taskId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    await deleteMutation.mutateAsync(deletingTaskId);
    setDeletingTaskId(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilter(key as keyof TaskFilterParams, value || undefined);
  };

  const handleResetFilters = () => {
    setFilterParams({
      page: 1,
      limit: APP_CONFIG.PAGINATION_LIMIT,
      keyword: "",
      status: undefined,
      staffId: undefined,
      scheduleId: undefined,
      binId: undefined,
      areaId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Phân công nhiệm vụ
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý và điều phối hoạt động thu gom rác theo thời gian thực
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white text-sm hover:bg-gray-50">
            🗺️ Xem bản đồ
          </button>
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
          >
            + Tạo nhiệm vụ thủ công
          </button>
        </div>
      </div>

      {/* ===== Summary ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="NHIỆM VỤ CHỜ"
          value={meta.totalItems.toString()}
          subtitle="+2 mới · 4 ưu tiên cao"
          percent={70}
          color="red"
          icon={<span className="text-xl">❗</span>}
        />
        <SummaryCard
          title="NHÂN VIÊN SẴN SÀNG"
          value="8 / 24"
          subtitle="Đủ nhân lực cho khu vực 1"
          percent={33}
          color="green"
          icon={<span className="text-xl">👤</span>}
        />
        <SummaryCard
          title="XE ĐANG HOẠT ĐỘNG"
          value="16"
          subtitle="3 xe đang bảo trì"
          percent={80}
          color="blue"
          icon={<span className="text-xl">🚚</span>}
        />
      </div>

      {/* ===== Main content ===== */}
      <div className="w-full">
        {/* ===== Filter ===== */}
        <div className="mb-6">
          <TaskFilterBar
            filters={{
              areaId: filterParams.areaId,
              status: filterParams.status,
              startDate: filterParams.startDate,
              endDate: filterParams.endDate,
            }}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* ===== Task list + pagination ===== */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-500">Đang tải nhiệm vụ...</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Không có nhiệm vụ nào</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id || task.id}
                    id={task._id || task.id}
                    status={
                      (task.status as "PENDING" | "IN_PROGRESS" | "DONE") ||
                      "PENDING"
                    }
                    code={task._id?.toString().slice(0, 8) || task.id || ""}
                    title={`Nhiệm vụ: ${task.schedule?.name}`}
                    address={`${task?.schedule?.areaId?.name}`}
                    time={
                      task.createdAt
                        ? new Date(task.createdAt).toLocaleString("vi-VN")
                        : ""
                    }
                    tags={[`${task.staffs?.length || 0} nhân viên`]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              <TaskPagination
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>

        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
        />

        <EditTaskModal
          taskId={editingTaskId || undefined}
          isOpen={!!editingTaskId}
          onClose={() => setEditingTaskId(null)}
        />

        <DeleteConfirmModal
          isOpen={!!deletingTaskId}
          taskName={
            tasks.find(
              (t) => t._id === deletingTaskId || t.id === deletingTaskId,
            )?.schedule?.name
          }
          isDeleting={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTaskId(null)}
        />
      </div>
    </div>
  );
};

export default TaskAssignmentPage;
