import { useState } from "react";
import { Plus, AlertTriangle, MapPin } from "lucide-react";

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
import { useCollectionPoints } from "@/features/collection-points/hooks/useCollectionPoints";
import { CollectionPointFilters } from "@/features/collection-points/components/CollectionPointFilters";
import { CollectionPointTable } from "@/features/collection-points/components/CollectionPointTable";
import CollectionPointModal from "@/features/collection-points/components/CollectionPointModal";
import { ICollectionPoint } from "@/features/collection-points/types";
import Pagination from "@/utils/pagination";

const CollectionPointManagementPage = () => {
  // --- A. USE HOOK (Central Logic) ---
  const {
    // Data
    collectionPoints,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,
    deleteCollectionPoint,
  } = useCollectionPoints(APP_CONFIG.PAGINATION_LIMIT);

  // --- B. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<ICollectionPoint | null>(null);
  const [pointToDelete, setPointToDelete] = useState<ICollectionPoint | null>(
    null,
  );

  // --- C. HANDLERS ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setPointToEdit(null); // Reset mode tạo mới
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (point: ICollectionPoint) => {
    setPointToEdit(point); // Pass data vào form edit
    setIsModalOpen(true);
  };

  // 3. Handle Delete Confirm
  const handleDelete = () => {
    if (pointToDelete) {
      deleteCollectionPoint(pointToDelete.id, {
        onSuccess: () => setPointToDelete(null),
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
        title="Quản lý Điểm Tập Kết"
        subtitle={`Hệ thống đang quản lý ${totalItems} điểm tập kết rác thải trên bản đồ số.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <Plus className="size-4 mr-2" /> Thêm điểm mới
          </Button>
        }
      />

      {/* 2. FILTERS */}
      <CollectionPointFilters
        filters={filterParams}
        setFilters={setFilterParams}
      />

      {/* 3. TABLE AREA */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden ">
        {isLoading ? (
          // Loading State: Render Skeleton đúng chuẩn Table Structure
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[350px] pl-4">Điểm tập kết</TableHead>
                <TableHead className="w-[250px]">Khu vực quản lý</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* CollectionPointTable có 4 cột nên skeleton để cols=4 */}
              <TableSkeleton rows={pageSize} cols={4} />
            </TableBody>
          </Table>
        ) : collectionPoints.length === 0 ? (
          // Empty State: Smart UI Result
          <div className="flex items-center justify-center">
            <SmartWasteResult
              status="empty"
              title="Không tìm thấy điểm tập kết"
              description="Chưa có dữ liệu địa điểm hoặc không khớp với bộ lọc khu vực."
              primaryAction={{
                label: "Thêm địa điểm ngay",
                onClick: handleOpenCreate,
                icon: <MapPin className="size-4" />,
              }}
            />
          </div>
        ) : (
          // Data State
          <CollectionPointTable
            data={collectionPoints}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setPointToDelete}
          />
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && collectionPoints.length > 0 && (
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
      <CollectionPointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={pointToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!pointToDelete}
        onCancel={() => setPointToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa điểm tập kết?"
        isLoading={isMutating}
        isDestructive={true}
        confirmLabel="Xóa địa điểm"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xóa điểm tập kết{" "}
              <strong className="text-foreground">{pointToDelete?.name}</strong>
              ?
            </p>

            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium items-start">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>Lưu ý quan trọng:</span>
                <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
                  <li>Hành động này không thể hoàn tác.</li>
                  <li>
                    Nếu điểm này đang được gắn với các{" "}
                    <strong>Thùng rác</strong>, dữ liệu của các thùng rác đó có
                    thể bị lỗi hiển thị.
                  </li>
                  <li>
                    Cần cập nhật lại <strong>Lộ trình thu gom</strong> của các
                    xe nếu đi qua điểm này.
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

export default CollectionPointManagementPage;
