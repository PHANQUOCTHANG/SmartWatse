import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IVehicle } from "@/features/vehicles/types";
import { IBin } from "@/features/bin/types";
import { IArea } from "@/features/area/types";
import { ICollectionPoint } from "@/features/collection-points/types";
// 🔥 QUAN TRỌNG: Import API Service, KHÔNG import Hook
import { mapService } from "@/features/map-monitor/api/mapApi";

// --- 1. STATE INTERFACE ---
interface MapState {
  isLoading: boolean;
  error: string | null;

  // Config hiển thị
  layers: {
    bins: boolean;
    vehicles: boolean;
    areas: boolean;
  };

  // Data hiển thị
  vehicles: Record<string, IVehicle>;
  bins: Record<string, IBin>;
  areas: IArea[];
  points: ICollectionPoint[];

  // Routing
  activeRoute: {
    start: [number, number];
    end: [number, number];
    vehicleId?: string;
  } | null;

  // Modal & Location Picker
  isBinModalOpen: boolean;
  selectedBin: IBin | null;
  isPickingLocation: boolean;
  tempLocation: { lat: number; lng: number } | null;
}

const initialState: MapState = {
  isLoading: false,
  error: null,
  layers: { bins: true, vehicles: true, areas: true },
  vehicles: {},
  bins: {},
  areas: [],
  points: [],
  activeRoute: null,
  isBinModalOpen: false,
  selectedBin: null,
  isPickingLocation: false,
  tempLocation: null,
};

// --- 2. ASYNC THUNKS (ĐÃ SỬA CHUẨN) ---
export const fetchMapData = createAsyncThunk(
  "map/fetchInitialData",
  async (_, { rejectWithValue }) => {
    try {
      // 🔥 GỌI API TRỰC TIẾP TẠI ĐÂY (Thay vì gọi hook)
      const [areasRes, pointsRes, binsRes, vehiclesRes] = await Promise.all([
        mapService.getAreas(),
        mapService.getPoints(),
        mapService.getBins(),
        mapService.getVehicles(),
      ]);

      return {
        areas: areasRes.data,
        points: pointsRes.data,
        bins: binsRes.data,
        vehicles: vehiclesRes.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi tải dữ liệu bản đồ");
    }
  },
);

// --- 3. SLICE ---
export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    toggleLayer: (state, action: PayloadAction<keyof MapState["layers"]>) => {
      state.layers[action.payload] = !state.layers[action.payload];
    },
    setRoute: (state, action: PayloadAction<MapState["activeRoute"]>) => {
      state.activeRoute = action.payload;
    },
    clearRoute: (state) => {
      state.activeRoute = null;
    },

    // --- Actions cho Bin Modal ---
    startPickLocation: (state) => {
      state.isPickingLocation = true;
      state.tempLocation = null;
      state.isBinModalOpen = false;
    },
    confirmLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>,
    ) => {
      state.isPickingLocation = false;
      state.tempLocation = action.payload;
      state.selectedBin = null;
      state.isBinModalOpen = true;
    },
    openEditBinModal: (state, action: PayloadAction<IBin>) => {
      state.selectedBin = action.payload;
      // Map coordinates to tempLocation
      const lat =
        action.payload.location?.coordinates[1] ?? action.payload.latitude;
      const lng =
        action.payload.location?.coordinates[0] ?? action.payload.longitude;
      state.tempLocation = { lat, lng };
      state.isBinModalOpen = true;
    },
    closeBinModal: (state) => {
      state.isBinModalOpen = false;
      state.selectedBin = null;
      state.tempLocation = null;
      state.isPickingLocation = false;
    },

    // --- Socket Actions (Realtime) ---
    updateVehicleSocket: (
      state,
      action: PayloadAction<Partial<IVehicle> & { id: string }>,
    ) => {
      const { id, ...changes } = action.payload;
      if (state.vehicles[id]) {
        state.vehicles[id] = { ...state.vehicles[id], ...changes };
      }
    },
    addVehicleSocket: (state, action: PayloadAction<IVehicle>) => {
      state.vehicles[action.payload.id] = action.payload;
    },
    removeVehicleSocket: (state, action: PayloadAction<string>) => {
      delete state.vehicles[action.payload];
    },
    updateBinSocket: (
      state,
      action: PayloadAction<Partial<IBin> & { id: string }>,
    ) => {
      const { id, ...changes } = action.payload;
      if (state.bins[id]) {
        state.bins[id] = { ...state.bins[id], ...changes };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.areas = action.payload.areas;
        state.points = action.payload.points;

        // Convert Array -> Record để truy xuất nhanh
        state.bins = action.payload.bins.reduce(
          (acc, bin) => {
            acc[bin.id] = bin;
            return acc;
          },
          {} as Record<string, IBin>,
        );

        state.vehicles = action.payload.vehicles.reduce(
          (acc, veh) => {
            acc[veh.id] = veh;
            return acc;
          },
          {} as Record<string, IVehicle>,
        );
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  toggleLayer,
  setRoute,
  clearRoute,
  updateVehicleSocket,
  addVehicleSocket,
  removeVehicleSocket,
  updateBinSocket,
  startPickLocation,
  confirmLocation,
  openEditBinModal,
  closeBinModal,
} = mapSlice.actions;

export default mapSlice.reducer;
