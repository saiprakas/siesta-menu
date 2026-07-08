import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu.jsx";
import Ops from "./pages/Ops.jsx";
import "./styles/base.css";

/* This project is the QR MENU + OPS PANEL only.
   The website lives in its own folder: "SIESTA DESSERT CAFE WEBISTE".
   Routes:
     /        → the QR menu (point the table QR here)
     /#/ops   → staff ops panel  */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/ops" element={<Ops />} />
        <Route path="*" element={<Menu />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
