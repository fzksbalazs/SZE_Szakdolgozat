// src/pages/DesignerEmbedPage.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux"; // igazítsd a saját reduceredhez

const DESIGNER_URL = process.env.REACT_APP_DESIGNER_URL;
const API_BASE = process.env.REACT_APP_API_BASE;

export default function DesignerEmbedPage() {
  const iframeRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  // (Opcionális) továbbküldöd a productId/color-t a designernek query-ben:
  const src = useMemo(() => {
    const qs = new URLSearchParams(location.search); // /designer?productId=...&color=...
    const url = new URL(DESIGNER_URL);
    // átirányítás a designer felé ugyanazokkal a querykkel:
    url.search = qs.toString();
    return url.toString();
  }, [location.search]);

  useEffect(() => {
    const allowedOrigin = new URL(DESIGNER_URL).origin;

    async function uploadToCloudinary(dataUrl) {
      const res = await fetch(`${API_BASE}/api/upload-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json(); // { url, public_id }
    }

    async function onMessage(e) {
      if (e.origin !== allowedOrigin) return;
      const { type, payload } = e.data || {};
      if (type !== "DONE") return;

      try {
        // 1) feltöltés Cloudinary-ra backendünkön keresztül
        const { url } = await uploadToCloudinary(payload.image);

        // 2) kosárba helyezés (helyi state/Redux – igazítsd saját struktúrádhoz)
        dispatch(
          addProduct({
            productId: payload.productId,
            quantity: 1,
            variant: {
              color: payload.color,
              mode: payload.mode, // "logo"/"full"
            },
            customImageUrl: url,
          })
        );

        // 3) átnavigálás a kosár oldalra
        history.push("/cart");
      } catch (err) {
        console.error("Mentés hiba:", err);
        alert("Nem sikerült elmenteni a mintát. Próbáld újra!");
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [dispatch, history]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        ref={iframeRef}
        title="T-Shirt Designer"
        src={src}
        style={{ border: "none", width: "100%", height: "100%" }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
