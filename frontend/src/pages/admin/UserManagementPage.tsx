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
import { useUsers } from "@/features/user/hooks/useUsers";
import { IUser } from "@/features";
import { UserFilters } from "@/features/user/components/UserFilters";
import { UserTable } from "@/features/user/components/UserTable";
import UserModal from "@/features/user/components/UserModal";
import Pagination from "@/utils/pagination";

const UserManagementPage = () => {
  // --- A. USE HOOK (Central Logic) ---
  const {
    // Data
    users,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,
    deleteUser,
  } = useUsers(APP_CONFIG.PAGINATION_LIMIT);

  // --- B. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  // --- C. HANDLERS ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setUserToEdit(null); // Reset để form biết là tạo mới
    setIsModalOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (user: IUser) => {
    setUserToEdit(user); // Pass data vào form
    setIsModalOpen(true);
  };

  // 3. Handle Delete Confirm
  const handleDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete._id, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  // --- D. RENDER HELPERS ---
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-8 pb-32 max-w-[1600px] mx-auto">
      {/* 1. HEADER */}
      <PageHeader
        title="Quản lý Người dùng"
        subtitle={`Hệ thống hiện có ${totalItems} tài khoản đang hoạt động.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <Plus className="size-4 mr-2" /> Thêm người dùng
          </Button>
        }
      />

      {/* 2. FILTERS */}
      <UserFilters filters={filterParams} setFilters={setFilterParams} />

      {/* 3. TABLE AREA */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          // Loading State: Render Skeleton đúng chuẩn Table Structure
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[300px] pl-4">Người dùng</TableHead>
                <TableHead className="w-[150px]">Vai trò</TableHead>
                <TableHead className="hidden sm:table-cell w-[150px]">
                  Liên hệ
                </TableHead>
                <TableHead className="hidden md:table-cell">Địa chỉ</TableHead>
                <TableHead className="w-[120px]">Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={pageSize} cols={6} />
            </TableBody>
          </Table>
        ) : users.length === 0 ? (
          // Empty State: Smart UI Result
          <div className="flex items-center justify-center py-20">
            <SmartWasteResult
              status="empty"
              title="Không tìm thấy người dùng"
              description="Chưa có tài khoản nào được tạo hoặc không khớp với bộ lọc hiện tại."
              primaryAction={{
                label: "Thêm người dùng mới",
                onClick: handleOpenCreate,
                icon: <Plus className="size-4" />,
              }}
            />
          </div>
        ) : (
          // Data State
          <UserTable
            data={users}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setUserToDelete}
          />
        )}
      </div>

      {/* 4. PAGINATION */}
      {!isLoading && users.length > 0 && (
        <div className="pt-2 flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems} // Nếu component Pagination của bạn hỗ trợ hiển thị range
            itemsPerPage={pageSize}
          />
        </div>
      )}

      {/* 5. MODALS */}

      {/* Create / Edit Form */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa tài khoản?"
        isLoading={isMutating}
        isDestructive={true}
        confirmLabel="Xóa vĩnh viễn"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong className="text-foreground">
                {userToDelete?.fullName}
              </strong>{" "}
              ({userToDelete?.email})?
            </p>

            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium items-start">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <span>
                Cảnh báo: Hành động này sẽ xóa vĩnh viễn tài khoản, lịch sử đăng
                nhập và các báo cáo liên quan. Không thể hoàn tác.
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default UserManagementPage;
