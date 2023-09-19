import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-full">
      <NextUIProvider className="h-full flex flex-col">
        <Router>
          <App />
        </ Router>

      </NextUIProvider>
    </div>
  </React.StrictMode>
);
