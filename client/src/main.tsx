import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import App from "@/pages/App";
import Login from "./pages/Login";
import Album from "./pages/Album";
import Albums from "./pages/Albums";
import Tags from "./pages/Tags";
import Account from "./pages/Account";
import { AuthProvider } from "./context/AuthContext";
import { AlbumProvider } from "./context/AlbumContext";
import { TagProvider } from "./context/TagContext";
import { ModalProvider } from "./context/ModalContext";
import LoadingModal from "./components/LoadingModal";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <TagProvider>
            <AlbumProvider>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<LoadingModal />}>
                  <Route path="/" element={<App />} />
                  <Route path="/albums/:albumId" element={<Album />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/tags" element={<Tags />} />
                  <Route path="/account" element={<Account />} />
                </Route>
              </Routes>
            </AlbumProvider>
          </TagProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
