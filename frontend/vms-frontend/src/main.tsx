import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex flex-col h-full">
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </div>
  </React.StrictMode>
);
