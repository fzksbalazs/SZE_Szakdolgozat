// Designer.jsx (webshop)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";

const DESIGNER_URL = "https://wearable-3d.vercel.app";         // pl. https://wearable-3d.vercel.app
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Designer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const iframeRef = useRef(null);
  const handledRef = useRef(false); // <— őr a dupla-kezelés ellen
  const query = useQuery();

  const src = useMemo(() => {
    // átküldheted a query-t tovább
    const url = new URL(DESIGNER_URL);
    url.search = query.toString();
    return url.toString();
  }, [query]);

  useEffect(() => {
    const allowedOrigin = new URL(DESIGNER_URL).origin;

    async function uploadToCloudinary(dataUrl, productId) {
      const resp = await fetch(`${API_BASE}/api/custom/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl, productId }),
      });
      if (!resp.ok) throw new Error("Upload failed");
      return resp.json(); // { url, public_id, productId }
    }

    async function onMessage(e) {
      if (e.origin !== allowedOrigin) return;
      const { type, payload } = e.data || {};
      if (type !== "DONE") return;

      // őr: csak egyszer dolgozzuk fel
      if (handledRef.current) return;
      handledRef.current = true;

      try {
        const { url } = await uploadToCloudinary(
          payload.imageDataUrl,
          payload.productId
        );

        // kosárba rakás (szükség szerint állítsd a struktúrát)
        dispatch(
          addProduct({
            _id: payload.productId, // ha kell az _id a reduceredhez
            title: "Custom T-shirt",
            price: 0,
            quantity: 1,
            customImageUrl: url,
            variant: {
              color: payload.baseColor,
              mode: payload.isFullTexture ? "full" : "logo",
            },
          })
        );

        history.push("/cart");
      } catch (err) {
        console.error("Mentés hiba:", err);
        alert("Nem sikerült elmenteni a mintát. Próbáld újra!");
        handledRef.current = false; // engedjük újrapróbálni
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
      />
    </div>
  );
}
