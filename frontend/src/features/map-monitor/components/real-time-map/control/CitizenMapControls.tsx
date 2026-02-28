import React, { useState } from "react";
import {
  Crosshair,
  Camera,
  Trash2,
  Recycle,
  Leaf,
  Info,
  X,
  Clock,
  Footprints,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// --- TYPES ---
export type BinFilterType = "ALL" | "ORGANIC" | "RECYCLE" | "INORGANIC";

interface Props {
  onFilterChange: (type: BinFilterType) => void;
  onLocateMe: () => void;
  onReportIssue: () => void;
  onNavigateToBin?: () => void;

  selectedBin?: {
    id: string;
    address: string;
    type: string;
    distance?: string;
    walkTime?: string;
    status: "ACTIVE" | "FULL" | "MAINTENANCE";
  } | null;

  isNavigating?: boolean;
}

export const CitizenMapControls = ({
  onFilterChange,
  onLocateMe,
  onReportIssue,
  onNavigateToBin,
  selectedBin,
  isNavigating = false,
}: Props) => {
  const [activeFilter, setActiveFilter] = useState<BinFilterType>("ALL");

  // =========================
  // CITIZEN ACTION HANDLER
  // =========================
  const citizenActions = {
    filterBins: (type: BinFilterType) => {
      setActiveFilter(type);
      onFilterChange(type);
    },

    locateMe: () => {
      onLocateMe();
    },

    reportIssue: () => {
      onReportIssue();
    },

    navigateToBin: () => {
      onNavigateToBin?.();
    },

    clearSelectedBin: () => {
      onFilterChange("ALL");
    },
  };

  return (
    <>
      {/* FLOATING BUTTONS */}
      <div className="absolute right-4 bottom-48 z-[1000] flex flex-col gap-3">
        {/* Report */}
        <div className="relative group">
          <Button
            onClick={citizenActions.reportIssue}
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl bg-red-600 hover:bg-red-700 text-white border-4 border-white/50"
          >
            <Camera className="size-6" />
          </Button>

          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Báo cáo vi phạm
          </span>
        </div>

        {/* Locate */}
        <Button
          onClick={citizenActions.locateMe}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-white text-slate-700 border border-slate-200"
        >
          <Crosshair className="size-6 text-blue-600" />
        </Button>
      </div>

      {/* BOTTOM SHEET */}
      <div className="absolute bottom-6 left-4 right-4 z-[1000] flex justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border-0 overflow-hidden flex flex-col">
          {selectedBin ? (
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-3 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                      selectedBin.type === "ORGANIC"
                        ? "bg-green-100 text-green-600"
                        : selectedBin.type === "RECYCLE"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600",
                    )}
                  >
                    {selectedBin.type === "ORGANIC" ? (
                      <Leaf size={20} />
                    ) : selectedBin.type === "RECYCLE" ? (
                      <Recycle size={20} />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">
                      {selectedBin.address}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {selectedBin.type}
                      </Badge>

                      {selectedBin.status === "FULL" && (
                        <Badge variant="destructive" className="text-[10px]">
                          Đầy rác
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={citizenActions.clearSelectedBin}
                >
                  <X size={18} />
                </Button>
              </div>

              <Separator className="mb-3" />

              {/* Info + Navigate */}
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-50 rounded-xl p-2 flex items-center justify-around border">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 justify-center">
                      <Footprints size={10} /> Khoảng cách
                    </div>
                    <div className="font-bold text-indigo-600 text-sm">
                      {selectedBin.distance || "--"}
                    </div>
                  </div>

                  <div className="w-px h-6 bg-slate-200"></div>

                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1 justify-center">
                      <Clock size={10} /> Đi bộ
                    </div>
                    <div className="font-bold text-indigo-600 text-sm">
                      {selectedBin.walkTime || "--"}
                    </div>
                  </div>
                </div>

                <Button
                  className={cn(
                    "flex-1 font-bold",
                    isNavigating
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700",
                  )}
                  onClick={citizenActions.navigateToBin}
                >
                  {isNavigating ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Dừng dẫn đường
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4 fill-current" />
                      Dẫn đường
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* FILTER MODE */
            <div className="flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Tìm thùng rác gần nhất
                </span>
              </div>

              <ScrollArea className="w-full whitespace-nowrap px-4 py-3">
                <div className="flex w-max space-x-2">
                  <FilterChip
                    label="Tất cả"
                    active={activeFilter === "ALL"}
                    onClick={() => citizenActions.filterBins("ALL")}
                  />

                  <FilterChip
                    label="Rác hữu cơ"
                    icon={<Leaf size={14} />}
                    active={activeFilter === "ORGANIC"}
                    color="green"
                    onClick={() => citizenActions.filterBins("ORGANIC")}
                  />

                  <FilterChip
                    label="Tái chế"
                    icon={<Recycle size={14} />}
                    active={activeFilter === "RECYCLE"}
                    color="blue"
                    onClick={() => citizenActions.filterBins("RECYCLE")}
                  />

                  <FilterChip
                    label="Rác khác"
                    icon={<Trash2 size={14} />}
                    active={activeFilter === "INORGANIC"}
                    color="orange"
                    onClick={() => citizenActions.filterBins("INORGANIC")}
                  />
                </div>

                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

// =========================
// FILTER CHIP
// =========================
const FilterChip = ({ label, icon, active, color, onClick }: any) => {
  const activeStyles: any = {
    green: "bg-green-600 text-white border-green-600",
    blue: "bg-blue-600 text-white border-blue-600",
    orange: "bg-orange-600 text-white border-orange-600",
    default: "bg-slate-800 text-white border-slate-800",
  };

  const style = active
    ? activeStyles[color] || activeStyles.default
    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95",
        style,
      )}
    >
      {icon}
      {label}
    </button>
  );
};
