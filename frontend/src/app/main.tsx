import { createRoot } from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import 'leaflet/dist/leaflet.css';

import "@/index.css";

import { router } from "@/app/routes/route";
import { store } from "@/store/store";
import { injectStore } from "@/lib/axios";

// Inject store cho axios
injectStore(store);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 🔥 REDUX PROVIDER BẮT BUỘC */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
