import React, { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import authApi from "@/features/auth/api/authApi";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      console.log("🚀 Sending forgot password request for:", data.email);
      await authApi.forgotPassword(data.email);
      setSentEmail(data.email);
      setIsSent(true);

      toast.success("✅ Email sent successfully!", {
        description: "Vui lòng kiểm tra email để nhận mã xác thực.",
      });

      // Chuyển hướng sang trang xác thực OTP với email
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (error: any) {
      console.error("❌ Forgot password error:", error);
      const msg = error.response?.data?.message || "Request failed.";
      if (msg.toLowerCase().includes("email")) {
        setError("email", { type: "server", message: msg });
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
            alt="City"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">
              Smart Waste City
            </span>
          </div>
        </div>
        /* -- VIEW 1: INPUT -- */
        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Đừng lo lắng. Hãy nhập email đăng ký của bạn và chúng tôi sẽ gửi
              hướng dẫn khôi phục.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Địa chỉ Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  placeholder="nguyenvana@email.com"
                  className={cn(
                    "pl-10 h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-base",
                    errors.email &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                <>
                  Gửi yêu cầu
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
