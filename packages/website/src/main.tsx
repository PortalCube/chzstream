import React from "react";
import ReactDOM from "react-dom/client";
import App from "@web/App.tsx";
import "@web/index.scss";

import { createHandshakeRequestMessage } from "@chzstream/message";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
