import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Loader2, RotateCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import authApi from "@/features/auth/api/authApi";
import { login } from "@/features/auth/slice/authSlice";

// Component nhập OTP - 6 ô số
const OtpInput = ({
  length = 6,
  value,
  onChange,
  disabled,
}: {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus vào ô đầu tiên khi mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Xử lý khi nhập số
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;

    // ❗ Chỉ cho phép 1 ký tự số
    if (val.length > 1) return;
    if (!/^\d*$/.test(val)) return;

    // Cập nhật giá trị OTP
    const newOtp = value.split("");
    newOtp[index] = val;
    onChange(newOtp.join(""));

    // Tự động focus sang ô tiếp theo nếu nhập số
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý phím Backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      // Nếu ô hiện tại rỗng, quay lại ô trước
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        // Xóa ký tự hiện tại
        const newOtp = value.split("");
        newOtp[index] = "";
        onChange(newOtp.join(""));

        // Focus lại ô hiện tại sau khi xóa
        inputRefs.current[index]?.focus();
      }
    }
  };

  // Xử lý paste toàn bộ OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Chỉ lấy số, loại ký tự khác
    if (/^\d+$/.test(pastedData)) {
      const otpValue = pastedData.slice(0, length);
      onChange(otpValue);

      // Focus vào ô cuối cùng được điền
      setTimeout(() => {
        const nextIndex = Math.min(otpValue.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      }, 0);
    }
  };

  return (
    <div className="flex gap-3 justify-center w-full max-w-[360px] mx-auto">
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] || "";
        const isFilled = Boolean(digit);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-full aspect-square rounded-xl text-center text-2xl font-bold
              transition-all duration-200 border-2 outline-none
              ${
                isFilled
                  ? "border-gray-300 bg-gray-50 text-gray-900"
                  : "border-gray-200 bg-white text-gray-400"
              }
              focus:border-blue-600 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100 focus:text-blue-600
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        );
      })}
    </div>
  );
};

// Component đếm ngược thời gian
const ResendTimer = ({
  onResend,
  isLoading,
}: {
  onResend: (resetCallback: () => void) => Promise<void>;
  isLoading: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);

  // Đếm ngược mỗi giây
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format thời gian: (00:59)
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `(${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")})`;
  };

  // Xử lý khi click gửi lại
  const handleResend = async () => {
    await onResend(() => {
      setTimeLeft(59);
      setCanResend(false);
    });
  };

  return (
    <div className="text-center text-sm">
      {canResend ? (
        <button
          onClick={handleResend}
          disabled={isLoading}
          className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCw className="w-3.5 h-3.5" />
          )}
          Gửi lại mã
        </button>
      ) : (
        <span className="text-gray-600">
          Bạn chưa nhận được mã?{" "}
          <span className="text-blue-600 font-medium">
            Gửi lại mã {formatTime()}
          </span>
        </span>
      )}
    </div>
  );
};

// Component chính - Form xác thực OTP
const VerifyOtpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailFromState = location.state?.email || "ad***@urbanwaste.gov.vn";
  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // ✅ Xử lý xác thực OTP - Chỉ gọi khi user bấm nút, không auto submit
  const handleVerify = async () => {
    // Kiểm tra OTP hợp lệ
    if (otp.length !== 6 || isLoading) return;

    setIsLoading(true);
    try {
      console.log("🚀 Verifying OTP for email:", email);
      const response = await authApi.verifyEmail({ email, otp });

      console.log("✅ Response received:", response);

      //Lấy resetToken từ response
      const resetToken = response.data?.resetToken;

      if (!resetToken) {
        throw new Error("Reset token không được trả về từ server");
      }

      console.log("Reset token received");

      toast.success("Xác thực thành công!", {
        description: "Tài khoản của bạn đã được xác minh.",
      });

      console.log("OTP verified successfully");

      // Chuyển sang trang reset password với resetToken
      navigate(`/reset-password/${resetToken}`, { state: { email, otp } });
    } catch (error: any) {
      console.error("❌ OTP verification error:", error);
      const msg =
        error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.";

      toast.error(msg);
      setOtp(""); // Reset OTP để thử lại
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý gửi lại OTP
  const handleResend = async (resetTimer: () => void) => {
    setResendLoading(true);
    try {
      console.log("📤 Resending OTP to:", email);
      await authApi.resendOtp(email);

      toast.success("Đã gửi lại mã OTP.", {
        description: "Vui lòng kiểm tra email của bạn.",
      });

      console.log("✅ OTP resent successfully");
      resetTimer(); // Reset đồng hồ đếm ngược
    } catch (error: any) {
      console.error("❌ Resend OTP error:", error);
      const msg = error.response?.data?.message || "Gửi lại mã OTP thất bại.";

      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* ===== BÊN TRÁI: MARKETING ===== */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between bg-gradient-to-br from-[#1e5a96] to-[#0d3a5f] p-12 text-white relative overflow-hidden">
        {/* Ảnh nền */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-0" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
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
          <span className="font-bold tracking-wide text-sm">
            URBAN WASTE MANAGER
          </span>
        </div>

        {/* Nội dung marketing */}
        <div className="relative z-10 mb-12 space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            Quản lý thông minh cho môi
            <br />
            trường xanh sạch
          </h1>
          <p className="text-blue-100 text-base max-w-md leading-relaxed">
            Hệ thống theo dõi, giám sát và tối ưu hóa quy trình thu gom rác thải
            đô thị theo thời gian thực.
          </p>
        </div>
      </div>

      {/* ===== BÊN PHẢI: FORM OTP ===== */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 lg:p-12 relative bg-gray-50">
        {/* Nút quay lại */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 lg:top-8 lg:left-12 flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang Đăng nhập
        </button>

        {/* Nội dung form */}
        <div className="w-full max-w-[440px] space-y-8">
          {/* Tiêu đề */}
          <div className="space-y-3">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <RotateCw className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Xác minh danh tính
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Vui lòng nhập mã 6 số chúng tôi vừa gửi tới email{" "}
              <span className="font-bold text-gray-900">{email}</span> để xác
              minh.
            </p>
          </div>

          {/* Các trường nhập */}
          <div className="space-y-6">
            {/* Input OTP */}
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
            />

            {/* Nút xác nhận */}
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.length < 6}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-sm text-base flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác nhận"
              )}
            </button>

            {/* Timer gửi lại */}
            <ResendTimer onResend={handleResend} isLoading={resendLoading} />
          </div>

          {/* Box hỗ trợ */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                i
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">Cần hỗ trợ?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nếu bạn không còn quyền truy cập vào email, vui lòng liên hệ
                Quản trị viên hệ thống hoặc gọi hotline{" "}
                <span className="text-blue-600 font-bold">1900 1234</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-xs text-gray-400 text-center">
          © 2023 Smart Urban Waste Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
