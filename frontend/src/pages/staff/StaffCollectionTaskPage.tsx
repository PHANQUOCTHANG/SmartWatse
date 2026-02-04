import { Briefcase, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Components
import PageHeader from "@/components/ui/PageHeader";
import SmartWasteResult from "@/components/ui/Result";
import Pagination from "@/utils/pagination";

// 2. Features Components
import { CollectionTaskFilters } from "@/features/task-assignment/components/CollectionTaskFilters";
import { CollectionTaskCard } from "@/features/task-assignment/components/CollectionTaskCard";

// 3. Logic & Hooks
import { APP_CONFIG } from "@/config/constants";
import { ITask } from "@/features/task-assignment/types";
import { useStaffTasks } from "@/features/task-assignment/hooks/useStaffTasks"; // Hook riêng cho Staff
import { useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const StaffCollectionTaskPage = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ Redux Store
  const { user } = useAppSelector((state) => state.auth);

  // --- A. USE HOOK (useStaffTasks) ---
  const {
    tasks,
    meta,
    filterParams,
    // States
    isLoading,
    // Actions
    setFilterParams,
    handlePageChange,
  } = useStaffTasks(user?.id, APP_CONFIG.PAGINATION_LIMIT);

  // --- B. HANDLERS ---
  const handleViewDetails = (task: ITask) => {
    // Điều hướng sang trang chi tiết (StaffCollectionTaskDetailPage)
    // ID có thể là _id hoặc id tùy backend trả về
    const taskId = task.id || task._id;
    navigate(`/staff/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* 1. HEADER */}
      <PageHeader
        title="Nhiệm vụ của tôi"
        subtitle="Quản lý danh sách nhiệm vụ thu gom được phân công cho bạn."
      />

      {/* 2. FILTERS */}
      <CollectionTaskFilters
        filters={filterParams}
        setFilters={setFilterParams}
      />

      {/* 3. CONTENT AREA */}
      <div className="min-h-[400px]">
        {isLoading ? (
          // Loading State
          <CardGridSkeleton count={6} />
        ) : tasks.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center h-full">
            <SmartWasteResult
              status="empty"
              title="Không có nhiệm vụ nào"
              description="Hiện tại bạn chưa được phân công nhiệm vụ nào hoặc không tìm thấy kết quả phù hợp với bộ lọc."
              icon={<Inbox className="size-16 text-slate-200 mb-4" />}
            />
          </div>
        ) : (
          // Data List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task: ITask) => (
              <CollectionTaskCard
                key={task._id || task.id}
                task={task}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && tasks.length > 0 && (
        <div className="pt-6 flex justify-center border-t border-slate-100 mt-6">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.pageSize}
          />
        </div>
      )}

      {/* Footer Info */}
      {!isLoading && tasks.length > 0 && (
        <div className="text-center text-xs text-slate-400 mt-4">
          Hiển thị {tasks.length} trên tổng số {meta.totalItems} nhiệm vụ
        </div>
      )}
    </div>
  );
};

export default StaffCollectionTaskPage;
const CardGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-0 space-y-0 overflow-hidden bg-white"
        >
          {/* Header Skeleton */}
          <div className="p-4 border-b bg-slate-50/50 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/3" />
          </div>
          {/* Content Skeleton */}
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex gap-4">
              <div className="w-1/2 space-y-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="w-1/2 space-y-1 border-l pl-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
          {/* Footer Skeleton */}
          <div className="p-3 border-t">
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
