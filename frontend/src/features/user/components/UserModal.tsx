import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Loader2,
  UserPlus,
  UserCog,
  Image as ImageIcon,
  Mail,
  Phone,
  User,
  Shield,
  MapPin,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IUser } from "../types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserModalLogic } from "@/features/user/hooks/useUserModalLogic";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: IUser | null;
}

const UserModal: React.FC<UserModalProps> = (props) => {
  const { isOpen, onClose, userToEdit } = props;

  // Sử dụng Hook Logic (Tương tự useBinModalLogic)
  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit,
  } = useUserModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
              {isEditing ? (
                <UserCog className="size-5" />
              ) : (
                <UserPlus className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground">
                {isEditing ? "Cập nhật Người dùng" : "Thêm Người dùng Mới"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Chỉnh sửa thông tin tài khoản và phân quyền."
                  : "Điền thông tin để tạo tài khoản mới vào hệ thống."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-muted/10">
          <form id="user-form" onSubmit={onSubmit} className="space-y-6">
            {/* 1. Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar Upload */}
              <div className="space-y-2 shrink-0">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Ảnh đại diện
                </Label>
                <div className="group relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-input hover:border-primary hover:bg-accent transition-all bg-background shadow-sm cursor-pointer mx-auto sm:mx-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
                      <User className="size-8 mb-1 opacity-50" />
                      <span className="text-[10px] font-bold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[1px]">
                    <ImageIcon className="size-5 mb-1" />
                    <span className="text-[9px] font-bold uppercase">
                      Thay đổi
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Main Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="fullName"
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <User className="size-3.5" /> Họ và Tên{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Nguyễn Văn A"
                    className={cn(
                      errors.fullName &&
                        "border-destructive focus-visible:ring-destructive/20",
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5" /> Email{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@mail.com"
                    disabled={isEditing} // Thường không cho sửa email
                    className={cn(
                      errors.email && "border-destructive",
                      isEditing && "opacity-70 bg-muted",
                    )}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Phone className="size-3.5" /> Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="0901234567"
                    className={cn(errors.phoneNumber && "border-destructive")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Role & Security Section */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border">
              <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-primary">
                <Shield className="size-4" /> Phân quyền & Bảo mật
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role Select */}
                <div className="space-y-2">
                  <Label className="text-xs">Vai trò hệ thống</Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CITIZEN">Người dân</SelectItem>
                          <SelectItem value="STAFF">
                            Nhân viên thu gom
                          </SelectItem>
                          <SelectItem value="MANAGER">
                            Quản lý khu vực
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            Quản trị viên (Admin)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Password (Optional on Edit) */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Lock className="size-3.5" />
                    {isEditing
                      ? "Mật khẩu mới (Để trống nếu không đổi)"
                      : "Mật khẩu khởi tạo"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className={cn(errors.password && "border-destructive")}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-destructive font-bold">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Address & Status */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border bg-slate-50/50 p-4 rounded-lg">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <MapPin className="size-3.5" /> Địa chỉ liên hệ
                </Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Số nhà, Tên đường, Phường/Xã..."
                />
              </div>

              {/* Status Switch (Chỉ hiện khi Edit) */}
              {isEditing && (
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Trạng thái hoạt động
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Kích hoạt hoặc vô hiệu hóa tài khoản này.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background shrink-0 z-20">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="font-bold border-input bg-background hover:bg-accent hover:text-foreground"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={isPending}
            className="font-bold shadow-md px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 min-w-[120px]"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo tài khoản"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UserModal;
