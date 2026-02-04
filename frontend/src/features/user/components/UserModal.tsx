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
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IUser, UserRole } from "../types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserModalLogic } from "@/features/user/hooks/useUserModalLogic";

// Map Components
import { MapAreaSelect } from "@/features/area/components/MapAreaSelect";
import { MapCoordinatePicker } from "@/features/map-monitor/components/MapCoordinatePicker";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: IUser | null;
}

const UserModal: React.FC<UserModalProps> = (props) => {
  const { isOpen, onClose, userToEdit } = props;

  const {
    form: {
      register,
      control,
      setValue,
      watch,
      formState: { errors },
    },
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit,
  } = useUserModalLogic(props);

  const selectedRole = watch("role");
  const isManagerOrStaff = [UserRole.MANAGER, UserRole.STAFF].includes(
    selectedRole as UserRole,
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative z-[101] w-full max-w-4xl bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
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
                {isEditing ? "Cập nhật Hồ sơ" : "Thêm Người dùng Mới"}
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
          <form id="user-form" onSubmit={onSubmit} className="space-y-8">
            {/* ---------------- SECTION 1: THÔNG TIN CÁ NHÂN ---------------- */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Column */}
              <div className="md:w-1/4 flex flex-col items-center space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ảnh đại diện
                </Label>
                <div className="group relative w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl ring-2 ring-border/50 bg-background cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/30 group-hover:bg-muted/50 transition-colors">
                      <User className="size-10 mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase">
                        Tải ảnh lên
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300 backdrop-blur-sm">
                    <ImageIcon className="size-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
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
                <p className="text-[10px] text-muted-foreground text-center px-4">
                  Hỗ trợ: JPG, PNG. Tối đa 5MB.
                </p>
              </div>

              {/* Basic Info Inputs */}
              <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5" /> Họ và Tên{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register("fullName")}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className={cn(
                      "h-10",
                      errors.fullName && "border-destructive",
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="size-3.5" /> Email{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="example@mail.com"
                    disabled={isEditing}
                    className={cn("h-10", errors.email && "border-destructive")}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="size-3.5" /> Số điện thoại
                  </Label>
                  <Input
                    {...register("phoneNumber")}
                    placeholder="0901234567"
                    className={cn(
                      "h-10",
                      errors.phoneNumber && "border-destructive",
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-border/60 w-full" />

            {/* ---------------- SECTION 2: BẢO MẬT & PHÂN QUYỀN ---------------- */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                  <Shield className="size-4" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Phân quyền & Bảo mật
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    Vai trò hệ thống
                  </Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-white h-10">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value={UserRole.CITIZEN}>
                            Cư dân (Citizen)
                          </SelectItem>
                          <SelectItem value={UserRole.STAFF}>
                            Nhân viên thu gom (Staff)
                          </SelectItem>
                          <SelectItem value={UserRole.MANAGER}>
                            Quản lý khu vực (Manager)
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>
                            Quản trị viên (Admin)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Lock className="size-3.5 text-muted-foreground" />{" "}
                    {isEditing
                      ? "Mật khẩu mới (Không bắt buộc)"
                      : "Mật khẩu khởi tạo"}
                  </Label>
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className={cn(
                      "bg-white h-10",
                      errors.password && "border-destructive",
                    )}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {isManagerOrStaff && (
                  <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                      <LayoutGrid className="size-3.5" /> Khu vực phụ trách{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="areaId"
                      render={({ field, fieldState }) => (
                        <MapAreaSelect
                          value={field.value || ""}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          placeholder="Chọn khu vực hoạt động..."
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-border/60 w-full" />

            {/* ---------------- SECTION 3: ĐỊA CHỈ & BẢN ĐỒ ---------------- */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
                  <MapPin className="size-4" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Địa chỉ liên hệ
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Cột trái: Ô nhập liệu địa chỉ */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold">
                    Địa chỉ chi tiết
                  </Label>
                  <div className="relative">
                    <Textarea
                      {...register("address")}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                      className={cn(
                        "min-h-[120px] resize-none pr-10 text-sm leading-relaxed bg-white",
                        errors.address && "border-destructive",
                      )}
                    />
                    <MapPin className="absolute top-3 right-3 size-4 text-muted-foreground opacity-50" />
                  </div>
                  {errors.address && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.address.message}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground italic">
                    * Bạn có thể nhập tay hoặc chọn vị trí trên bản đồ bên cạnh
                    để tự động điền.
                  </p>
                </div>

                {/* Cột phải: Map Picker */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-blue-600">
                    Chọn vị trí trên bản đồ
                  </Label>
                  <div className="h-[120px] w-full rounded-lg overflow-hidden border border-input shadow-sm relative group">
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <MapCoordinatePicker
                          // Nếu có địa chỉ string, ta mock tọa độ HCM để map không bị lỗi
                          // Người dùng sẽ kéo marker để chọn lại vị trí chính xác
                          value={
                            field.value
                              ? {
                                  lat: 10.762622,
                                  lng: 106.660172,
                                  address: field.value,
                                }
                              : undefined
                          }
                          onChange={(val) => {
                            // Khi chọn trên map, lấy address string điền vào form
                            if (val.address) {
                              setValue("address", val.address, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }
                          }}
                          placeholder="Nhấn để mở bản đồ"
                        />
                      )}
                    />
                    {/* Overlay hint */}
                    <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- SECTION 4: TRẠNG THÁI ---------------- */}
            {isEditing && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-foreground">
                    Trạng thái hoạt động
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Kích hoạt để cho phép người dùng đăng nhập.
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
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background shrink-0 z-20">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="font-semibold"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={isPending}
            className="min-w-[140px] font-bold shadow-md"
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
