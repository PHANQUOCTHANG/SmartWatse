import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Loader2, RotateCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/store";
import authApi from "@/features/auth/api/authApi";
import { login } from "@/features/auth/slice/authSlice";
import { Button } from "@/components/ui/button"; // Standard Shadcn Button

// --- 1. OTP INPUT COMPONENT (Light Theme) ---
const OtpInput: React.FC<{
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ length = 6, value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    if (val.length <= length) onChange(val);
  };

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto"
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-default caret-transparent disabled:cursor-not-allowed"
        value={value}
        onChange={handleChange}
      />
      <div className="flex gap-3 justify-between w-full pointer-events-none">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || "";
          const isActive =
            value.length < length
              ? index === value.length
              : index === length - 1;
          const isFilled = index < value.length;

          return (
            <div key={index} className="relative flex-1 aspect-square">
              <div
                className={cn(
                  "w-full h-full rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-200 border",
                  // Light Theme Styles
                  isActive
                    ? "border-[#1A73E8] bg-white ring-4 ring-blue-50 text-[#1A73E8]" // Active State
                    : isFilled
                    ? "border-gray-300 bg-gray-50 text-gray-900" // Filled State
                    : "border-gray-200 bg-gray-50/50 text-gray-400" // Empty State
                )}
              >
                {digit}
                {isActive && !isFilled && (
                  <div className="w-0.5 h-6 bg-[#1A73E8] animate-pulse rounded-full absolute" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- 2. TIMER COMPONENT (Light Theme) ---
const ResendTimer = ({
  onResend,
  isLoading,
}: {
  onResend: (cb: () => void) => void;
  isLoading: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState(59); // 59s like design
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  return (
    <div className="text-center text-sm text-gray-500 font-medium">
      {canResend ? (
        <button
          onClick={() =>
            onResend(() => {
              setTimeLeft(59);
              setCanResend(false);
            })
          }
          disabled={isLoading}
          className="text-[#1A73E8] hover:underline flex items-center justify-center gap-1.5 mx-auto"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCw className="w-3.5 h-3.5" />
          )}
          Gửi lại mã mới
        </button>
      ) : (
        <span>
          Bạn chưa nhận được mã?{" "}
          <span className="text-gray-400">
            Gửi lại mã ({timeLeft.toString().padStart(2, "0")})
          </span>
        </span>
      )}
    </div>
  );
};

// --- 3. MAIN FORM ---
interface VerifyOtpFormProps {
  email?: string; // e.g., "ad***@urbanwaste.gov.vn"
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle Verify Logic
  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      // Mock API or Real API
      // await authApi.verifyEmail({ email: email!, otp });
      await new Promise((r) => setTimeout(r, 1500));

      toast.success("Xác thực thành công!");
      navigate("/login"); // Or dispatch login if response has token
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mã OTP không đúng.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend Logic
  const handleResend = async (resetTimer: () => void) => {
    setResendLoading(true);
    try {
      // await authApi.resendOtp(email!);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Đã gửi lại mã OTP.");
      resetTimer();
    } catch (error) {
      toast.error("Gửi lại thất bại.");
    } finally {
      setResendLoading(false);
    }
  };

  // Auto-submit effect
  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp]);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      {/* ==========================================
          LEFT SIDE: BLUE MARKETING (Same as Login)
         ========================================== */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between bg-[#0F4C81] p-12 text-white relative overflow-hidden">
        {/* Background Image/Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "url('/login.img')",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold tracking-widest text-sm uppercase">
            URBAN WASTE MANAGER
          </span>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 mb-12">
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Quản lý thông minh cho <br /> môi trường xanh sạch
          </h1>
          <p className="text-blue-100/80 text-lg max-w-md font-light leading-relaxed">
            Hệ thống theo dõi, giám sát và tối ưu hóa quy trình thu gom rác thải
            đô thị theo thời gian thực.
          </p>
        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE: OTP FORM
         ========================================== */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center text-gray-500 hover:text-[#1A73E8] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang Đăng nhập
        </button>

        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Icon Header */}
          <div className="mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A73E8]">
              <RotateCw className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Xác minh danh tính
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Vui lòng nhập mã 6 số chúng tôi vừa gửi tới email <br />
              <span className="font-bold text-gray-900">
                {email || "email@domain.com"}
              </span>{" "}
              để xác minh.
            </p>
          </div>

          {/* OTP Input Grid */}
          <div className="space-y-8">
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
            />

            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.length < 6}
              className="w-full h-12 bg-[#1A73E8] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-base"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Xác nhận"}
            </Button>

            <ResendTimer onResend={handleResend} isLoading={resendLoading} />
          </div>

          {/* Help Box (Matches Image) */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 flex gap-3 border border-gray-100 mt-8">
            <div className="shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[#1A73E8] text-xs font-bold">
                i
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">Cần hỗ trợ?</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nếu bạn không còn quyền truy cập vào email, vui lòng liên hệ
                Quản trị viên hệ thống hoặc gọi hotline{" "}
                <span className="text-[#1A73E8] font-bold">1900 1234</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-[10px] text-gray-400 font-medium">
          © 2023 Smart Urban Waste Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
