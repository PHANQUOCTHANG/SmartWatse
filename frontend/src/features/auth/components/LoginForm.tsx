import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Eye, EyeOff, User, Facebook, Chrome } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const { form, onSubmit, showPassword, toggleShowPassword } = useLogin();

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* ========================================================
          LEFT SIDE: BLUE BANNER
          ======================================================== */}
      <div className="hidden w-1/2 lg:flex flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* 1. BACKGROUND IMAGE (Từ public/login.img) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            // Lưu ý: Đảm bảo file ảnh nằm đúng tại public/login.img (hoặc .jpg/.png)
            backgroundImage:
              "url('https://www.invert.vn/media/uploads/uploads/11184444-ecopark-nhon-trach-min.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* 2. BLUE OVERLAY (Lớp phủ màu xanh để text rõ ràng) */}
        {/* mix-blend-multiply giúp màu xanh hòa vào ảnh nền tạo chiều sâu */}
        <div className="absolute inset-0 bg-[#0F4C81]/90 z-0 mix-blend-multiply" />

        {/* 3. GRID PATTERN (Tùy chọn: Thêm họa tiết lưới mờ nếu ảnh nền chưa có) */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* --- CONTENT (z-10 để nổi lên trên nền) --- */}
        <div className="relative z-10">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-16 opacity-95">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase">
              Ecomanage City
            </span>
          </div>

          {/* Big Typography */}
          <h1 className="text-5xl text-background font-extrabold leading-[1.15] tracking-tight mb-8">
            Hệ thống Quản lý <br />
            Rác thải Đô thị <br />
            Thông minh
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-blue-100/90 max-w-md font-medium leading-relaxed">
            Smart Solutions for a Cleaner City. Giám sát thời gian thực, tối ưu
            hóa lộ trình và kết nối cộng đồng vì một môi trường xanh.
          </p>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-xs text-blue-200/70 font-medium tracking-wide">
          © 2023 Smart Urban Waste Management System
        </div>
      </div>

      {/* ========================================================
          RIGHT SIDE: LOGIN FORM
          ======================================================== */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-white">
        <div className="mx-auto w-full max-w-[400px] space-y-8">
          {/* Header Form */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Chào mừng trở lại
            </h2>
            <p className="text-muted-foreground text-gray-500 text-sm">
              Vui lòng nhập thông tin đăng nhập để truy cập hệ thống quản lý.
            </p>
          </div>

          {/* Form Inputs */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Username / Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Tên đăng nhập
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  placeholder="example@city.gov.vn"
                  className={`h-11 bg-gray-50/50 pr-10 border-gray-200 focus:bg-white focus:border-blue-500 transition-all ${
                    errors.email
                      ? "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                      : ""
                  }`}
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 font-medium ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Mật khẩu
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#1A73E8] hover:text-blue-700 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 bg-gray-50/50 pr-10 border-gray-200 focus:bg-white focus:border-blue-500 transition-all ${
                    errors.password
                      ? "border-red-500 ring-1 ring-red-500 bg-red-50/10"
                      : ""
                  }`}
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 font-medium ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Global Error Message */}
            {errors.root && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 animate-in fade-in slide-in-from-top-1">
                {errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-[15px] font-semibold bg-[#1A73E8] hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium tracking-wide">
                Hoặc
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              className="h-11 font-medium text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="h-11 font-medium text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" /> Facebook
            </Button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-5 pt-2">
            <div className="text-sm text-gray-500">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#1A73E8] hover:underline"
              >
                Đăng ký tài khoản
              </Link>
            </div>

            <div className="flex gap-6 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
