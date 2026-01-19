import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Chrome,
  Facebook,
  Recycle,
  History,
  ArrowLeft,
} from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// --- Sub-component: Form Input (Responsive & Touch Friendly) ---
const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  register,
  togglePass,
  showPass,
}: any) => (
  <div className="space-y-1.5 w-full">
    <Label
      htmlFor={id}
      className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1"
    >
      {label}
    </Label>
    <div className="relative group">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        // h-12 cho mobile dễ bấm, text-base để không bị zoom trên iOS
        className={cn(
          "pl-11 h-12 bg-gray-50/50 border-gray-200 text-base md:text-sm focus:bg-white focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all rounded-xl",
          error &&
            "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-red-200"
        )}
        {...register}
      />
      <Icon
        className={cn(
          "absolute left-3.5 top-3.5 size-5 transition-colors",
          error
            ? "text-red-400"
            : "text-gray-400 group-focus-within:text-[#1A73E8]"
        )}
      />

      {togglePass && (
        <button
          type="button"
          onClick={togglePass}
          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 focus:outline-none active:scale-95 transition-transform"
        >
          {showPass ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p className="text-[11px] text-red-500 font-bold ml-1 animate-in slide-in-from-top-1 fade-in">
        {error.message}
      </p>
    )}
  </div>
);

// --- Main Component ---
const RegisterForm = () => {
  const {
    form: {
      register,
      setValue,
      watch,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useRegister();

  const termsValue = watch("terms");

  return (
    // Wrapper chính: Padding nhỏ trên mobile (p-3), lớn trên desktop
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F6F8] p-3 md:p-6 font-sans">
      {/* Card: Full width trên mobile, Max width trên Desktop */}
      <div className="w-full max-w-[1200px] bg-white rounded-[2rem] shadow-xl md:shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[750px]">
        {/* ==========================================
            LEFT SIDE: MARKETING (HIDDEN ON MOBILE)
            Chỉ hiện khi màn hình >= 1024px (lg)
           ========================================== */}
        <div className="hidden lg:flex w-[40%] bg-[#F0F7FF] p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#1A73E8 1.5px, transparent 1.5px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="z-10 relative space-y-6">
            <div className="flex items-center gap-2 text-[#1A73E8] font-bold tracking-tight">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <Recycle className="size-5" />
              </div>
              <span>SmartWaste</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-[1.2]">
              Kiến tạo đô thị <br />{" "}
              <span className="text-[#1A73E8]">Xanh - Sạch - Đẹp</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm">
              Tham gia cùng hàng triệu người dân và tổ chức để tối ưu hóa quy
              trình thu gom rác thải.
            </p>
          </div>

          <div className="z-10 relative flex-1 flex items-center justify-center">
            <div className="relative w-64 aspect-square rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white rotate-3 hover:rotate-0 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop"
                alt="Eco City"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="z-10 relative">
            <div className="flex -space-x-2 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="size-8 rounded-full border-2 border-white"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User"
                />
              ))}
              <div className="size-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                +2k
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Đã có hơn 2,000 người tham gia hôm nay.
            </p>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE: FORM (FULL WIDTH ON MOBILE)
           ========================================== */}
        <div className="w-full lg:w-[60%] relative flex flex-col">
          {/* Mobile Header: Nút Back & Logo nhỏ */}
          <div className="flex lg:hidden items-center justify-between p-4 pb-0">
            <Link
              to="/login"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="size-5 text-gray-600" />
            </Link>
            <span className="font-bold text-[#1A73E8] flex items-center gap-2">
              <Recycle className="size-4" /> SmartWaste
            </span>
            <div className="w-9" /> {/* Spacer */}
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
            <div className="max-w-[520px] mx-auto w-full space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Đăng Ký Tài Khoản
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Điền thông tin chi tiết để bắt đầu hành trình xanh.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <FormInput
                  id="fullName"
                  label="Họ và tên"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  icon={User}
                  error={errors.fullName}
                  register={register("fullName")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="name@email.com"
                    icon={Mail}
                    error={errors.email}
                    register={register("email")}
                  />
                  <FormInput
                    id="phone"
                    label="Số điện thoại"
                    type="tel"
                    placeholder="0901234567"
                    icon={Phone}
                    error={errors.phone}
                    register={register("phone")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    id="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ ký tự"
                    icon={Lock}
                    error={errors.password}
                    register={register("password")}
                    togglePass={() => setShowPassword(!showPassword)}
                    showPass={showPassword}
                  />
                  <FormInput
                    id="confirmPassword"
                    label="Xác nhận"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    icon={History}
                    error={errors.confirmPassword}
                    register={register("confirmPassword")}
                    togglePass={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    showPass={showConfirmPassword}
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-xl">
                  <Checkbox
                    id="terms"
                    onCheckedChange={(c) => setValue("terms", c as boolean)}
                    className={cn(
                      "mt-0.5 border-gray-400 data-[state=checked]:bg-[#1A73E8] data-[state=checked]:border-[#1A73E8]",
                      errors.terms && "border-red-500"
                    )}
                  />
                  <div className="grid gap-0.5">
                    <label
                      htmlFor="terms"
                      className="text-xs text-gray-600 font-medium cursor-pointer leading-relaxed"
                    >
                      Tôi đồng ý với{" "}
                      <Link
                        to="#"
                        className="text-[#1A73E8] font-bold hover:underline"
                      >
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link
                        to="#"
                        className="text-[#1A73E8] font-bold hover:underline"
                      >
                        Chính sách bảo mật
                      </Link>{" "}
                      của SmartWaste.
                    </label>
                    {errors.terms && (
                      <p className="text-[10px] text-red-500 font-bold">
                        {errors.terms.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !termsValue}
                  className="w-full h-12 md:h-14 bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Tạo Tài Khoản Mới"
                  )}
                </Button>

                {/* Social Login Mobile Friendly */}
                <div className="space-y-4 pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-[10px] uppercase text-gray-400 font-bold">
                        Hoặc tiếp tục với
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      className="h-11 md:h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <Chrome className="mr-2 size-5 text-red-500" />{" "}
                      <span className="text-gray-700 font-semibold text-xs md:text-sm">
                        Google
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="h-11 md:h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <Facebook className="mr-2 size-5 text-blue-600" />{" "}
                      <span className="text-gray-700 font-semibold text-xs md:text-sm">
                        Facebook
                      </span>
                    </Button>
                  </div>
                </div>
              </form>

              <div className="text-center text-sm font-medium pb-4">
                Đã là thành viên?{" "}
                <Link
                  to="/login"
                  className="text-[#1A73E8] font-bold hover:underline"
                >
                  Đăng nhập tại đây
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
