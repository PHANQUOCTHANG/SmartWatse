import { createRoot } from "react-dom/client";
import React from "react";
 
import "leaflet/dist/leaflet.css";

import "@/index.css";

import { store } from "@/store/store";
import { injectStore } from "@/lib/axios";
import { AppWithRouter } from "@/app/providers";

// Inject store cho axios
injectStore(store);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
);
