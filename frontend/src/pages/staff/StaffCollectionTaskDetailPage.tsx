import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Fuel,
  Weight,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Logic & Types
import { TaskStatus } from "@/features/task-assignment/types";
import {
  useTaskDetail,
  useUpdateTaskStatus,
} from "@/features/task-assignment/hooks/useTaskDetail";

const StaffCollectionTaskDetailPage = () => {
  const navigate = useNavigate();

  // Lấy ID từ URL (đảm bảo tên biến khớp với route, ví dụ :id hoặc :taskId)
  // Tôi dùng 'taskId' theo log của bạn, nhưng nếu route là :id thì sửa lại thành id
  const { taskId } = useParams<{ taskId: string }>();

  // 1. Lấy dữ liệu
  const { data: task, isLoading, isError } = useTaskDetail(taskId);

  // 2. Mutation Update
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus(
    taskId!,
  );

  // --- HANDLERS ---
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (taskId) updateStatus(newStatus);
  };

  // Hàm gọi điện thoại (Thay thế cho Button asChild bị lỗi)
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <AlertTriangle className="size-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy nhiệm vụ
        </h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Nhiệm vụ này có thể đã bị xóa hoặc đường dẫn không tồn tại.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // --- HELPER RENDERERS ---
  const renderMapPlaceholder = () => (
    <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
      <div className="absolute inset-0 bg-slate-200 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_placeholder.png')] bg-cover bg-center" />
      <div className="z-10 bg-white p-2 rounded-full shadow-lg">
        <MapPin className="size-6 text-red-500 fill-red-100" />
      </div>
      <span className="z-10 text-xs font-semibold mt-2 bg-white/90 px-3 py-1 rounded shadow-sm text-slate-700">
        {task.schedule?.areaId?.name || "Chưa định vị"}
      </span>
    </div>
  );

  const renderStatusBanner = () => {
    const configs = {
      [TaskStatus.PENDING]: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: Clock,
        label: "Đang chờ xử lý",
        action: { label: "Bắt đầu nhiệm vụ", next: TaskStatus.IN_PROGRESS },
      },
      [TaskStatus.IN_PROGRESS]: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: PlayCircle,
        label: "Đang thực hiện",
        action: {
          label: "Hoàn thành nhiệm vụ",
          next: TaskStatus.DONE,
          btnColor: "bg-emerald-600 hover:bg-emerald-700",
        },
      },
      [TaskStatus.DONE]: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        icon: CheckCircle2,
        label: "Đã hoàn thành",
        action: null,
      },
      DEFAULT: {
        // Fallback để tránh lỗi nếu status null/undefined
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-800",
        icon: AlertTriangle,
        label: "Trạng thái: " + task.status,
        action: null,
      },
    };

    const config = configs[task.status as TaskStatus] || configs["DEFAULT"];
    const Icon = config.icon;

    return (
      <div
        className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl border ${config.bg} ${config.border} ${config.text} mb-6 gap-4 shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white/60`}>
            <Icon className="size-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{config.label}</h2>
            <p className="text-sm opacity-80 flex items-center gap-1">
              Cập nhật lần cuối:{" "}
              {format(new Date(task.updatedAt || new Date()), "HH:mm dd/MM")}
            </p>
          </div>
        </div>

        {config.action && (
          <Button
            size="lg"
            onClick={() => handleStatusChange(config.action!.next)}
            disabled={isUpdating}
            className={`w-full sm:w-auto shadow-sm font-semibold ${config.action.btnColor || ""}`}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Đang xử lý...
              </>
            ) : (
              config.action.label
            )}
          </Button>
        )}
      </div>
    );
  };

  // --- SAFE CALCULATIONS ---
  const vehicle = task.vehicle;
  // Tính % tải trọng (tránh chia cho 0 ra NaN)
  const loadPercentage =
    vehicle && vehicle.capacity > 0
      ? ((vehicle.currentLoad || 0) / vehicle.capacity) * 100
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 space-y-6 animate-in fade-in duration-500">
      {/* 1. TOP NAV */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="size-5 text-slate-600" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 line-clamp-1">
            {task.schedule?.name || "Chi tiết nhiệm vụ"}
          </h1>
          <p className="text-sm text-slate-500 font-mono">
            ID: #{task.id?.slice(-6) || task._id?.slice(-6)}
          </p>
        </div>
      </div>

      {/* 2. STATUS BANNER */}
      {renderStatusBanner()}

      {/* 3. MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. Location & Note */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Khu vực làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {renderMapPlaceholder()}

              {task.note ? (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                  <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">
                      Ghi chú từ quản lý:
                    </span>
                    {task.note}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-400 italic text-center">
                  Không có ghi chú thêm
                </div>
              )}
            </CardContent>
          </Card>

          {/* B. Team Members */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-primary" /> Danh sách nhân sự (
                {task.staffs?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {task.staffs?.map((staff) => (
                <div
                  key={staff.id || staff._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-white shadow-sm">
                      <AvatarImage src={staff.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {staff.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-slate-900">
                        {staff.fullName}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5"
                      >
                        {staff.role}
                      </Badge>
                    </div>
                  </div>

                  {/* --- FIX LỖI CRASH Ở ĐÂY --- */}
                  {/* Bỏ asChild, dùng onClick để an toàn */}
                  {staff.phoneNumber && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-9 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-100"
                        onClick={() => handleCall(staff.phoneNumber!)} // Sửa ở đây
                      >
                        <Phone className="size-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="size-9 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-100"
                      >
                        <MessageSquare className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-6">
          {/* C. Time */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-4 text-primary" /> Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Ngày thực hiện
                  </p>
                  <p className="font-medium">
                    {task.schedule?.scheduledDate
                      ? format(
                          new Date(task.schedule.scheduledDate),
                          "dd/MM/yyyy",
                          { locale: vi },
                        )
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                <div className="text-center w-1/2 border-r">
                  <span className="block text-slate-400 text-xs mb-1">
                    Bắt đầu
                  </span>
                  <span className="font-bold text-lg">
                    {task.schedule?.startTime || "--:--"}
                  </span>
                </div>
                <div className="text-center w-1/2">
                  <span className="block text-slate-400 text-xs mb-1">
                    Kết thúc
                  </span>
                  <span className="font-bold text-lg">
                    {task.schedule?.endTime || "--:--"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* D. Vehicle */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="size-4 text-primary" /> Phương tiện
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              {vehicle ? (
                <>
                  <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xl font-bold text-slate-900 tracking-wide">
                      {vehicle.plateNumber}
                    </p>
                    <Badge variant="outline" className="mt-1 bg-white">
                      {vehicle.type}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {/* Fuel */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Fuel className="size-3.5" /> Nhiên liệu
                        </span>
                        <span
                          className={
                            (vehicle.fuelLevel || 0) < 20
                              ? "text-red-600"
                              : "text-emerald-600"
                          }
                        >
                          {vehicle.fuelLevel || 0}%
                        </span>
                      </div>
                      <Progress
                        value={vehicle.fuelLevel || 0}
                        className="h-2"
                      />
                    </div>

                    {/* Load */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Weight className="size-3.5" /> Tải trọng
                        </span>
                        <span>
                          {vehicle.currentLoad || 0} / {vehicle.capacity} tấn
                        </span>
                      </div>
                      <Progress
                        value={loadPercentage}
                        className="h-2 bg-slate-100"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Chưa gán phương tiện
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffCollectionTaskDetailPage;
