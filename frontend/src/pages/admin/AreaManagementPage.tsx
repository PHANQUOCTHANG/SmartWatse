import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";

// 1. UI Components (Shared)
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SmartWasteResult from "@/components/ui/Result";

// 2. Table Components (Cho Skeleton Layout)
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/ui/TableSkeleton";

// 3. Feature Components & Hooks
import { APP_CONFIG } from "@/config/constants";
import { useAreas, useParentAreas } from "@/features/area/hooks/useAreas";
import { IArea } from "@/features/area/types";
import { AreaFilters } from "@/features/area/components/AreaFilters";
import Pagination from "@/utils/pagination";
import AreaModal from "@/features/area/components/AreaModal";
import { AreaTable } from "@/features/area/components/AreaTable";

const AreaManagementPage = () => {
  // --- A. USE HOOK (Central Logic) ---
  const {
    // Data
    areas,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,
    deleteArea,
  } = useAreas(APP_CONFIG.PAGINATION_LIMIT);

  // Lấy danh sách Quận để truyền vào Filter (dùng cho dropdown lọc theo cha)
  const { data: parentAreas } = useParentAreas();

  // --- B. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState<IArea | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<IArea | null>(null);

  // --- C. HANDLERS ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setAreaToEdit(null); // Reset mode tạo mới
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (area: IArea) => {
    setAreaToEdit(area); // Pass data vào form edit
    setIsModalOpen(true);
  };

  // 3. Handle Delete Confirm
  const handleDelete = () => {
    if (areaToDelete) {
      deleteArea(areaToDelete.id, {
        onSuccess: () => setAreaToDelete(null),
      });
    }
  };

  // --- D. RENDER HELPERS ---
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-8 pb-32 max-w-[1600px] mx-auto p-6">
      {/* 1. HEADER */}
      <PageHeader
        title="Quản lý Khu vực Hành chính"
        subtitle={`Hệ thống bao gồm ${totalItems} đơn vị hành chính (Quận/Huyện & Phường/Xã).`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <Plus className="size-4 mr-2" /> Thêm khu vực
          </Button>
        }
      />

      {/* 2. FILTERS */}
      <AreaFilters
        filters={filterParams}
        setFilters={setFilterParams}
        parentOptions={parentAreas || []} // Truyền danh sách quận vào dropdown lọc
      />

      {/* 3. TABLE AREA */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          // Loading State: Render Skeleton đúng chuẩn Table Structure
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[300px] pl-4">Tên khu vực</TableHead>
                <TableHead className="w-[180px]">Cấp hành chính</TableHead>
                <TableHead>Trực thuộc</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* AreaTable có 5 cột nên skeleton để cols=5 */}
              <TableSkeleton rows={pageSize} cols={5} />
            </TableBody>
          </Table>
        ) : areas.length === 0 ? (
          // Empty State: Smart UI Result
          <div className="flex items-center justify-center">
            <SmartWasteResult
              status="empty"
              title="Không tìm thấy khu vực"
              description="Chưa có dữ liệu hành chính nào hoặc không khớp với bộ lọc hiện tại."
              primaryAction={{
                label: "Thêm khu vực mới",
                onClick: handleOpenCreate,
                icon: <Plus className="size-4" />,
              }}
            />
          </div>
        ) : (
          // Data State
          <AreaTable
            data={areas}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setAreaToDelete}
          />
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && areas.length > 0 && (
        <div className="pt-2 flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </div>
      )}

      {/* 5. MODALS */}

      {/* Create / Edit Form */}
      <AreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        areaToEdit={areaToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!areaToDelete}
        onCancel={() => setAreaToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa khu vực?"
        isLoading={isMutating}
        isDestructive={true}
        confirmLabel="Xóa vĩnh viễn"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xóa khu vực{" "}
              <strong className="text-foreground">{areaToDelete?.name}</strong>?
            </p>

            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium items-start">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>Cảnh báo quan trọng:</span>
                <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
                  <li>Hành động này không thể hoàn tác.</li>
                  <li>
                    Nếu đây là <strong>Quận/Huyện</strong>, bạn phải xóa hết các
                    Phường/Xã trực thuộc trước.
                  </li>
                  <li>
                    Các điểm thu gom và thiết bị IoT thuộc khu vực này có thể bị
                    ảnh hưởng.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default AreaManagementPage;
