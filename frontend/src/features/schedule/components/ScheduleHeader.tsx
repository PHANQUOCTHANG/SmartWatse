import { Plus, Filter } from "lucide-react";
import { useState } from "react";
import CreateScheduleModal from "./CreateScheduleModal";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/features/area/api/areaApi";
import { areaKeys } from "@/features/area/utils/areaKeys";

interface ScheduleHeaderProps {
  onRefresh?: () => void;
  selectedAreaId?: string;
  onAreaChange?: (areaId: string) => void;
}

export default function ScheduleHeader({
  onRefresh,
  selectedAreaId,
  onAreaChange,
}: ScheduleHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch danh sách khu vực
  const { data: areasData, isLoading: areasLoading } = useQuery({
    queryKey: areaKeys.list({ limit: 100 }),
    queryFn: () => areaApi.getAll({ limit: 100 }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <div className="flex items-center justify-between">

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Area Filter */}
          <div className="relative">
            <select
              value={selectedAreaId || ""}
              onChange={(e) => onAreaChange?.(e.target.value)}
              disabled={areasLoading}
              className="
                h-10 px-4
                text-sm font-medium
                rounded-lg
                border border-gray-200
                bg-white
                text-gray-700
                hover:bg-gray-50
                cursor-pointer
                transition
                appearance-none
                pr-8
              "
            >
              <option value="">
                {areasLoading ? "Đang tải khu vực..." : "Chọn khu vực"}
              </option>
              {areasData?.data?.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            {!areasLoading && (
              <Filter
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            )}
          </div>

          {/* Create */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              h-10 px-4
              flex items-center gap-2
              text-sm font-medium
              rounded-lg
              bg-blue-600
              text-white
              hover:bg-blue-700
              transition
              shadow-sm
            "
          >
            <Plus size={16} />
            Tạo Lịch Mới
          </button>
        </div>
      </div>

      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={onRefresh}
      />
    </>
  );
}
