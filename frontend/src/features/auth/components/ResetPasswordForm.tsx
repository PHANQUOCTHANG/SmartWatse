import React, { useState, useMemo } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  Recycle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import authApi from "@/features/auth/api/authApi";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- CONSTANTS ---
const PASSWORD_REQUIREMENTS = [
  { id: 1, label: "Ít nhất 8 ký tự", regex: /.{8,}/ },
  { id: 2, label: "Ít nhất một chữ viết hoa", regex: /[A-Z]/ },
  {
    id: 3,
    label: "Ít nhất một ký tự đặc biệt (!@#$...)",
    regex: /[^A-Za-z0-9]/,
  },
];

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 1. Setup Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  // 2. Logic Check Strength
  const requirementsStatus = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.regex.test(passwordValue || ""),
    }));
  }, [passwordValue]);

  // Determine Strength Bar Color (Red -> Yellow -> Green)
  const strengthScore = requirementsStatus.filter((r) => r.met).length;
  const strengthColor =
    strengthScore <= 1
      ? "bg-red-500"
      : strengthScore === 2
      ? "bg-yellow-500"
      : "bg-emerald-500";
  const strengthWidth = (strengthScore / 3) * 100;

  // 3. Submit Handler
  const onSubmit = async (data: ResetPasswordInput) => {
    // if (!token) { toast.error("Token không hợp lệ"); return; }
    try {
      // await authApi.resetPassword(token, data.password); // API Call
      await new Promise((r) => setTimeout(r, 1500)); // Mock
      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi hệ thống.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#EAF4FF] p-4 font-sans relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-to-bl from-blue-200/40 to-transparent rounded-bl-full pointer-events-none" />

      {/* Logo & Header outside Card (Matches Image 4) */}
      <div className="mb-8 text-center z-10">
        <div className="w-14 h-14 bg-[#1A73E8] rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-4">
          <Recycle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
          Quản lý rác thải đô thị
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-xl p-8 z-10 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn để tiếp tục truy
            cập hệ thống.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">
              Mật khẩu mới
            </Label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập ít nhất 8 ký tự"
                className={cn(
                  "pr-10 h-10 text-sm border-gray-200 focus:border-[#1A73E8] focus:ring-0 rounded-lg",
                  errors.password && "border-red-500"
                )}
                {...register("password")}
                onFocus={() => setIsFocused(true)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Strength Bar (Matches Image 4) */}
            {(isFocused || passwordValue) && (
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    strengthColor
                  )}
                  style={{ width: `${strengthWidth}%` }}
                />
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">
              Xác nhận mật khẩu mới
            </Label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className={cn(
                  "pr-10 h-10 text-sm border-gray-200 focus:border-[#1A73E8] focus:ring-0 rounded-lg",
                  errors.confirmPassword && "border-red-500"
                )}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Requirements Box (Matches Image 4) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
            <p className="text-xs font-bold text-gray-700 mb-2">
              Mật khẩu của bạn phải chứa:
            </p>
            {requirementsStatus.map((req) => (
              <div key={req.id} className="flex items-center gap-2">
                {req.met ? (
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
                )}
                <span
                  className={cn(
                    "text-xs transition-colors",
                    req.met ? "text-gray-700 font-medium" : "text-gray-400"
                  )}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-500/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
          </button>
        </div>
      </div>

      {/* Footer (Matches Image 4) */}
      <div className="mt-8 text-[10px] text-gray-400 font-medium">
        © 2023 Smart Urban Waste Management System. All rights reserved.
      </div>
    </div>
  );
};

export default ResetPasswordForm;
