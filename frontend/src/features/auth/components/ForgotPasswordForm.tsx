import React, { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
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
      // await authApi.forgotPassword(data.email); // API Call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock API
      setSentEmail(data.email);
      setIsSent(true);
      toast.success("Email sent successfully!");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Request failed.";
      if (msg.toLowerCase().includes("email")) {
        setError("email", { type: "server", message: msg });
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center   p-4 font-sans relative overflow-hidden">
      {/* Background Decor similar to screenshots */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%]   rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%]  rounded-full blur-[100px]" />

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl p-8 md:p-10 relative z-10">
        {/* -- VIEW 2: SUCCESS -- */}
        {isSent ? (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Kiểm tra email
              </h2>
              <p className="text-gray-500 text-sm">
                Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến <br />
                <span className="font-semibold text-gray-900">{sentEmail}</span>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => window.open("mailto:", "_blank")}
                className="w-full h-11 bg-[#1A73E8] hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Mở Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsSent(false)}
                className="w-full h-11 text-gray-600 hover:text-gray-900 font-medium"
              >
                Thử lại với email khác
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-[#1A73E8] font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </button>
            </div>
          </div>
        ) : (
          /* -- VIEW 1: INPUT -- */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto text-[#1A73E8] mb-4">
                <CheckCircle2 className="w-6 h-6" /> {/* Placeholder Icon */}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quên mật khẩu?
              </h1>
              <p className="text-gray-500 text-sm">
                Đừng lo, hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn
                lấy lại mật khẩu.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email đã đăng ký
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    className={cn(
                      "pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#1A73E8] transition-all rounded-lg",
                      errors.email && "border-red-500 bg-red-50/10"
                    )}
                    {...register("email")}
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1A73E8]" />
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
                className="w-full h-11 bg-[#1A73E8] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSubmitting ? "Đang gửi..." : "Gửi hướng dẫn"}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
