import { configureStore } from "@reduxjs/toolkit";

// Import Reducer
import authReducer from "@/features/auth/slice/authSlice";
import mapReducer from "@/features/map-monitor/slice/mapSlice";
import { injectStore, setGlobalAccessToken } from "@/lib/axios";

// ==========================================================
// 2. CẤU HÌNH STORE
// ==========================================================
export const store = configureStore({
  reducer: {
    auth: authReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// ==========================================================
// 3. TYPES (Phải định nghĩa ngay sau khi có store)
// ==========================================================

// ==========================================================
// 4. HOOKS (Phải đặt SAU Types thì mới dùng được RootState/AppDispatch)
// ==========================================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ==========================================================
// 5. SIDE EFFECTS (Đồng bộ với Axios)
// ==========================================================

// 💉 Inject store vào axios
injectStore(store);

// 🔄 Đồng bộ Token
let currentToken = store.getState().auth.token;

// Khởi tạo lần đầu
setGlobalAccessToken(currentToken);

store.subscribe(() => {
  const newState = store.getState();
  const newToken = newState.auth.token;

  if (newToken !== currentToken) {
    currentToken = newToken;
    setGlobalAccessToken(currentToken);
  }
});
