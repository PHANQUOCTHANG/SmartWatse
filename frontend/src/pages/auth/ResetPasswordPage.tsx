import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="min-h-screen w-full flex bg-background text-white font-sans selection:bg-indigo-500/30 overflow-hidden items-center justify-center">
        <div className="relative z-10 w-full max-w-[480px] p-6 sm:p-12">
          {/* VIEW SWITCHER */}
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
