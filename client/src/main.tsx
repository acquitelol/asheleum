import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";

import App from "@/pages/App";
import Login from "./pages/Login";
import Album from "./pages/Album";
import Albums from "./pages/Albums";
import Tags from "./pages/Tags";
import Account from "./pages/Account";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AlbumProvider } from "./context/AlbumContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AlbumProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<App />} />
              <Route path="/albums/:albumId" element={<Album />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Routes>
        </AlbumProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
