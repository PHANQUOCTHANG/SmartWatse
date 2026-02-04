import { createRoot } from "react-dom/client";
import React from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "@/index.css";

import { store } from "@/store/store";
import { injectStore } from "@/lib/axios";
import { AppWithRouter } from "@/app/provider";

// Inject store cho axios
injectStore(store);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
);
