import React, { memo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  User,
  Copy,
  UserX,
  UserCheck,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableSkeleton from "@/components/ui/TableSkeleton";
import SmartWasteResult from "@/components/ui/Result";

// Utilities & Types
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IUser, UserRole, UserStatus } from "../types";

// ============================================================================
// 1. HELPER CONFIGS
// ============================================================================

const getRoleConfig = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return {
        label: "Quản trị viên",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    case "MANAGER":
      return {
        label: "Quản lý khu vực",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "STAFF":
      return {
        label: "Nhân viên",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      };
    case "CITIZEN":
      return {
        label: "Người dân",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    default:
      return {
        label: "Tổ chức",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      };
  }
};

const getStatusConfig = (isActive: boolean) => {
  return isActive
    ? {
        label: "Hoạt động",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: <UserCheck className="size-3 mr-1" />,
      }
    : {
        label: "Đã khóa",
        color: "text-slate-500 bg-slate-100 border-slate-200",
        icon: <UserX className="size-3 mr-1" />,
      };
};

// ============================================================================
// 2. USER TABLE ROW (COMPONENT CON)
// ============================================================================

interface UserTableRowProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

const UserTableRow = memo(({ user, onEdit, onDelete }: UserTableRowProps) => {
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(user.email);
    toast.success("Đã sao chép email");
  };

  const roleConfig = getRoleConfig(user.role);
  const statusConfig = getStatusConfig(user.status === UserStatus.ACTIVE);

  // Helper tạo avatar fallback (Lấy chữ cái đầu của tên)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <TableRow className="group transition-colors border-b hover:bg-muted/40 cursor-pointer">
      {/* 1. User Identity (Avatar + Name + Email) */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage
              src={user.avatar}
              alt={user.fullName}
              className="object-cover"
            />
            <AvatarFallback className="font-bold bg-primary/10 text-primary">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex flex-col gap-0.5">
            <p className="font-semibold text-foreground truncate max-w-[200px]">
              {user.fullName}
            </p>
            <div
              className="flex items-center text-xs text-muted-foreground truncate group/email"
              title={user.email}
            >
              <Mail className="size-3 mr-1 shrink-0" />
              <span>{user.email}</span>
              <Copy
                onClick={handleCopyEmail}
                className="size-3 ml-1.5 opacity-0 group-hover/email:opacity-100 cursor-pointer hover:text-primary transition-opacity"
              />
            </div>
          </div>
        </div>
      </TableCell>

      {/* 2. Role Badge */}
      <TableCell>
        <Badge
          variant="outline"
          className={cn("font-medium border shadow-sm", roleConfig.color)}
        >
          {roleConfig.label}
        </Badge>
      </TableCell>

      {/* 3. Contact Info (Phone) */}
      <TableCell className="hidden sm:table-cell">
        {user.phoneNumber ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-3.5 shrink-0" />
            <span className="font-mono text-xs">{user.phoneNumber}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Chưa cập nhật
          </span>
        )}
      </TableCell>

      {/* 4. Address (Hidden on mobile) */}
      <TableCell className="hidden md:table-cell">
        <span
          className="text-sm text-muted-foreground truncate max-w-[200px] block"
          title={user.address}
        >
          {user.address || "---"}
        </span>
      </TableCell>

      {/* 5. Status Badge */}
      <TableCell>
        <div
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            statusConfig.color,
          )}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </div>
      </TableCell>

      {/* 6. Actions */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-slate-100 data-[state=open]:bg-slate-100"
            >
              <MoreHorizontal className="size-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="size-4 mr-2" /> Chỉnh sửa
            </DropdownMenuItem>

            {/* Logic: Nếu user active thì hiện khóa, nếu inactive thì hiện mở khóa (Optional) */}
            <DropdownMenuItem onClick={() => {}} className="text-slate-600">
              {user.status === UserStatus.ACTIVE ? (
                <UserX className="size-4 mr-2" />
              ) : (
                <UserCheck className="size-4 mr-2" />
              )}
              {user.status === UserStatus.ACTIVE ? "Khóa tài khoản" : "Mở khóa"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="size-4 mr-2" /> Xóa vĩnh viễn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
UserTableRow.displayName = "UserTableRow";

// ============================================================================
// 3. MAIN TABLE COMPONENT
// ============================================================================

interface UserTableProps {
  data: IUser[];
  isLoading: boolean;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px] text-xs font-bold uppercase text-muted-foreground pl-4">
              Người dùng
            </TableHead>
            <TableHead className="w-[150px] text-xs font-bold uppercase text-muted-foreground">
              Vai trò
            </TableHead>
            <TableHead className="hidden sm:table-cell w-[150px] text-xs font-bold uppercase text-muted-foreground">
              Liên hệ
            </TableHead>
            <TableHead className="hidden md:table-cell text-xs font-bold uppercase text-muted-foreground">
              Địa chỉ
            </TableHead>
            <TableHead className="w-[120px] text-xs font-bold uppercase text-muted-foreground">
              Trạng thái
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Custom Skeleton cho User Table
            <TableSkeleton rows={5} cols={6} />
          ) : data.length > 0 ? (
            data.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <SmartWasteResult
                  status="empty"
                  title="Không tìm thấy người dùng"
                  description="Thử tìm kiếm từ khóa khác hoặc thêm người dùng mới."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
