import { useState } from "react";
import { Plus, Trash2, MapPin, AlertTriangle } from "lucide-react";

// 1. UI Components (Shared)
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SmartWasteResult from "@/components/ui/Result"; // Component hiển thị kết quả/empty

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
import { BinFilters, BinTable, IBin, useBins } from "@/features/bin";
import { BinFormValues } from "@/features/bin/schemas/bin.schema";
import BinModal from "@/features/bin/components/BinModal";
import Pagination from "@/utils/pagination";

const BinManagementPage = () => {
  // --- A. USE HOOK (Central Logic) ---
  const {
    // Data
    bins,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,

    // Mutation Wrappers
    createBin,
    updateBin,
    deleteBin,
  } = useBins(APP_CONFIG.PAGINATION_LIMIT);

  // --- B. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [binToEdit, setBinToEdit] = useState<IBin | null>(null);
  const [binToDelete, setBinToDelete] = useState<IBin | null>(null);

  // --- C. HANDLERS ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setBinToEdit(null); // Reset để form biết là tạo mới
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (bin: IBin) => {
    setBinToEdit(bin); // Pass data vào form
    setIsModalOpen(true);
  };

  // 3. Handle Submit (Create/Update logic nằm trong Hook, ở đây chỉ gọi wrapper)
  // const handleSubmit = (data: BinFormValues) => {
  //   if (binToEdit) {
  //     updateBin(binToEdit._id, data, {
  //       onSuccess: () => setIsModalOpen(false),
  //     });
  //   } else {
  //     createBin(data, {
  //       onSuccess: () => setIsModalOpen(false),
  //     });
  //   }
  // };

  // 4. Handle Delete Confirm
  const handleDelete = () => {
    if (binToDelete) {
      deleteBin(binToDelete._id, {
        onSuccess: () => setBinToDelete(null),
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
        title="Quản lý Điểm Thu Gom"
        subtitle={`Hệ thống đang giám sát ${totalItems} thùng rác thông minh.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <Plus className="size-4 mr-2" /> Thêm thùng rác
          </Button>
        }
      />

      {/* 2. FILTERS */}
      <BinFilters filters={filterParams} setFilters={setFilterParams} />

      {/* 3. TABLE AREA */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          // Loading State: Render Skeleton đúng chuẩn Table Structure
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[250px]">Thông tin</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Mức chứa</TableHead>
                <TableHead>IoT Status</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={pageSize} cols={6} />
            </TableBody>
          </Table>
        ) : bins.length === 0 ? (
          // Empty State: Smart UI Result
          <div className="py-20 flex items-center justify-center">
            <SmartWasteResult
              status="empty"
              title="Không tìm thấy dữ liệu"
              description="Chưa có thùng rác nào được tạo hoặc không khớp với bộ lọc hiện tại."
              primaryAction={{
                label: "Tạo thùng rác mới",
                onClick: handleOpenCreate,
                icon: <Plus className="size-4" />,
              }}
            />
          </div>
        ) : (
          // Data State
          <BinTable
            data={bins}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setBinToDelete}
          />
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && bins.length > 0 && (
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
      <BinModal // Component này tự handle logic submit bên trong qua useBinModalLogic hoặc truyền props
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        binToEdit={binToEdit}
        // Nếu BinModal của bạn dùng logic hook bên trong thì ko cần truyền onSubmit ở đây,
        // nhưng nếu thiết kế dạng Dumb Component thì truyền như sau:
        // onSubmit={handleSubmit}
        // isPending={isMutating}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!binToDelete}
        onCancel={() => setBinToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa điểm thu gom?"
        isLoading={isMutating}
        isDestructive={true}
        confirmLabel="Xóa vĩnh viễn"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xóa thùng rác{" "}
              <strong className="text-foreground">{binToDelete?.code}</strong>?
            </p>
            {binToDelete?.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md border border-border/50">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{binToDelete.address}</span>
              </div>
            )}
            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium items-start">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <span>
                Cảnh báo: Hành động này sẽ xóa toàn bộ lịch sử thu gom và ngắt
                kết nối cảm biến IoT liên quan. Không thể hoàn tác.
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default BinManagementPage;
