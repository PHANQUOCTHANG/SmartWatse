import { create } from "zustand";
import { Bin } from "../types";

type MapMonitorState = {
  bins: Bin[];
  selectedBin: Bin | null;
  selectBin: (bin: Bin) => void;
  clearSelectedBin: () => void;
};

export const useMapMonitorStore = create<MapMonitorState>((set) => ({
  bins: [],
  selectedBin: null,

  selectBin: (bin) => set({ selectedBin: bin }),
  clearSelectedBin: () => set({ selectedBin: null }),
}));
