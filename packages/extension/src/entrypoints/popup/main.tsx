import React from "react";
import ReactDOM from "react-dom/client";
import App from "@extension/entrypoints/popup/App.tsx";
import "@/entrypoints/popup/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
