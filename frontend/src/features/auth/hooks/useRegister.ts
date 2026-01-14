import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// API & Schema
// import authApi from "@/features/auth/api/authApi"; // Bỏ comment khi dùng thật
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";

// Interface cho lỗi API
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errorCode?: string;
    };
  };
}

// Constants cho Password Strength
const PASSWORD_REQUIREMENTS = [
  { id: 1, label: "8+ ký tự", regex: /.{8,}/ },
  { id: 2, label: "Số", regex: /\d/ },
  { id: 3, label: "Chữ hoa", regex: /[A-Z]/ },
  { id: 4, label: "Ký tự đặc biệt", regex: /[^A-Za-z0-9]/ },
];

export const useRegister = () => {
  const navigate = useNavigate();

  // State UI local
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm cái này
  const [isFocused, setIsFocused] = useState(false); // Để hiện checklist khi focus password

  // 1. Setup Form
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // Đổi sang onChange để Real-time validate password strength mượt hơn
    defaultValues: {
      fullName: "",
      email: "",
      phone: "", // Mới thêm
      password: "",
      confirmPassword: "",
      role: "CITIZEN", // Mới thêm (Mặc định là Người dân)
      terms: false, // Mới thêm
    },
  });

  const { watch, setError } = form;
  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  // 2. Logic Tính độ mạnh mật khẩu (Real-time) - GIỮ NGUYÊN LOGIC CŨ
  const requirementsStatus = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.regex.test(passwordValue || ""),
    }));
  }, [passwordValue]);

  const strengthScore = requirementsStatus.filter((r) => r.met).length;

  // Helper lấy màu và text cho thanh độ mạnh
  const strengthInfo = useMemo(() => {
    if (!passwordValue)
      return {
        label: "Nhập mật khẩu",
        color: "bg-gray-200",
        textColor: "text-gray-400",
      };
    if (strengthScore <= 2)
      return { label: "Yếu", color: "bg-red-500", textColor: "text-red-500" };
    if (strengthScore === 3)
      return {
        label: "Trung bình",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
      };
    return {
      label: "Mạnh",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    };
  }, [strengthScore, passwordValue]);

  const isMatch =
    confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;

  // 3. Handle Submit
  const handleRegister = async (data: RegisterInput) => {
    try {
      // await authApi.register(data); // API Call thật

      // Giả lập API delay (Xóa dòng này khi lắp API thật)
      console.log("Submitting:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Tạo tài khoản thành công!", {
        description: "Vui lòng kiểm tra email để xác thực tài khoản.",
      });

      // Chuyển hướng sang trang OTP hoặc Login
      navigate("/login");
      // navigate("/verify-otp", { state: { email: data.email } });
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      const msg = error.response?.data?.message || "Đăng ký thất bại";

      // Map lỗi server vào input (Logic cũ + thêm Phone)
      const msgLower = msg.toLowerCase();

      if (msgLower.includes("email") || msgLower.includes("tồn tại")) {
        setError("email", { type: "manual", message: msg });
      } else if (
        msgLower.includes("phone") ||
        msgLower.includes("số điện thoại")
      ) {
        setError("phone", { type: "manual", message: msg }); // Mới thêm check phone
      } else if (msgLower.includes("name") || msgLower.includes("username")) {
        setError("fullName", { type: "manual", message: msg });
      } else {
        toast.error(msg);
      }
    }
  };

  return {
    form, // Trả về instance form
    onSubmit: form.handleSubmit(handleRegister),

    // UI Helpers state
    showPassword,
    setShowPassword, // Hàm set state trực tiếp (nếu cần)
    toggleShowPassword: () => setShowPassword(!showPassword), // Hàm toggle cũ

    showConfirmPassword,
    setShowConfirmPassword,
    toggleShowConfirmPassword: () =>
      setShowConfirmPassword(!showConfirmPassword),

    // Password Strength Helpers
    isFocused,
    setIsFocused,
    passwordValue,
    confirmPasswordValue,
    requirementsStatus,
    strengthScore,
    strengthInfo,
    isMatch,
  };
};
