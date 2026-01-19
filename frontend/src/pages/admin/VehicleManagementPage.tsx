import { useState } from "react";
import { Plus, AlertTriangle, Truck } from "lucide-react";

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
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { VehicleFilters } from "@/features/vehicles/components/VehicleFilters";
import { VehicleTable } from "@/features/vehicles/components/VehicleTable";
import VehicleModal from "@/features/vehicles/components/VehicleModal";
import { IVehicle } from "@/features/vehicles/types";
import Pagination from "@/utils/pagination";

const VehicleManagementPage = () => {
  // --- A. USE HOOK (Central Logic) ---
  const {
    // Data
    vehicles,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,
    deleteVehicle,
  } = useVehicles(APP_CONFIG.PAGINATION_LIMIT);

  // --- B. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<IVehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<IVehicle | null>(null);

  // --- C. HANDLERS ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setVehicleToEdit(null); // Reset mode tạo mới
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (vehicle: IVehicle) => {
    setVehicleToEdit(vehicle); // Pass data vào form edit
    setIsModalOpen(true);
  };

  // 3. Handle Delete Confirm
  const handleDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id, {
        onSuccess: () => setVehicleToDelete(null),
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
        title="Quản lý Đội xe Thu gom"
        subtitle={`Hệ thống đang vận hành ${totalItems} phương tiện vận chuyển rác thải.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <Plus className="size-4 mr-2" /> Thêm phương tiện
          </Button>
        }
      />

      {/* 2. FILTERS */}
      <VehicleFilters filters={filterParams} setFilters={setFilterParams} />

      {/* 3. TABLE AREA */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden ">
        {isLoading ? (
          // Loading State: Render Skeleton đúng chuẩn Table Structure
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[280px] pl-4">Phương tiện</TableHead>
                <TableHead className="w-[180px]">
                  Tải trọng & Mức chứa
                </TableHead>
                <TableHead>Nhiên liệu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* VehicleTable có 5 cột nên skeleton để cols=5 */}
              <TableSkeleton rows={pageSize} cols={5} />
            </TableBody>
          </Table>
        ) : vehicles.length === 0 ? (
          // Empty State: Smart UI Result
          <div className="flex items-center justify-center">
            <SmartWasteResult
              status="empty"
              title="Không tìm thấy phương tiện"
              description="Chưa có phương tiện nào trong hệ thống hoặc không khớp với bộ lọc."
              primaryAction={{
                label: "Thêm phương tiện mới",
                onClick: handleOpenCreate,
                icon: <Truck className="size-4" />,
              }}
            />
          </div>
        ) : (
          // Data State
          <VehicleTable
            data={vehicles}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setVehicleToDelete}
          />
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && vehicles.length > 0 && (
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
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleToEdit={vehicleToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!vehicleToDelete}
        onCancel={() => setVehicleToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa phương tiện?"
        isLoading={isMutating}
        isDestructive={true}
        confirmLabel="Xóa vĩnh viễn"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xóa xe{" "}
              <strong className="text-foreground">
                {vehicleToDelete?.plateNumber}
              </strong>
              ?
            </p>

            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium items-start">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>Cảnh báo quan trọng:</span>
                <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
                  <li>Hành động này không thể hoàn tác.</li>
                  <li>
                    Toàn bộ <strong>lịch sử di chuyển</strong> và dữ liệu IoT
                    của xe này sẽ bị mất.
                  </li>
                  <li>
                    Nếu xe đang trong ca làm việc (IN USE), hãy chắc chắn rằng
                    nó đã hoàn thành nhiệm vụ.
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

export default VehicleManagementPage;
