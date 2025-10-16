// Designer.jsx (webshop)
import React, { useEffect, useMemo, useRef} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";

const DESIGNER_URL = "https://wearable-3d.vercel.app"; 
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Designer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const iframeRef = useRef(null);
  const handledRef = useRef(false); 
  const query = useQuery();

  const src = useMemo(() => {
    
    const url = new URL(DESIGNER_URL);
    url.search = query.toString();
    return url.toString();
  }, [query]);

  useEffect(() => {
   

    async function uploadToCloudinary(dataUrl, productId) {
      const resp = await fetch(`${API_BASE}/api/custom/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl, productId }),
      });
      if (!resp.ok) throw new Error("Upload failed");
      return resp.json();
    }

    async function onMessage(e) {
      
      const { type, payload } = e.data || {};

     
      if (type === "DONE") {
        if (handledRef.current) return;
        handledRef.current = true;

        try {
          const { url } = await uploadToCloudinary(
            payload.imageDataUrl,
            payload.productId,
          );

          dispatch(
            addProduct({
              _id: payload.productId,
              title: "Egyedi Poló",
              price: 5000,
              quantity: 1,
              customImageUrl: url,
              color: payload.baseColor,
              size: payload.size || "M",

              variant: {
                color: payload.baseColor,
                mode: payload.isFullTexture ? "full" : "logo",
                size: payload.size || "M",
              },
            }),
          );

          history.push("/cart");
        } catch (err) {
          console.error("Mentés hiba:", err);
          alert("Nem sikerült elmenteni a mintát. Próbáld újra!");
          handledRef.current = false;
        }
      }

      if (type === "GO_HOME") {
        history.replace("/"); 
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [dispatch, history]);

  return (
    <div style={{ height: "100vh", width: "100%", backgroundColor: "#fff" }}>
      <iframe
        ref={iframeRef}
        title="T-Shirt Designer"
        src={src}
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
}
