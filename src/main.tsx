import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationsProvider position="top-center" >
        <App />
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
