import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

const DESIGNER_URL = process.env.REACT_APP_DESIGNER_URL || "https://wearable-3d.vercel.app";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Designer() {
  const history = useHistory();
  const iframeRef = useRef(null);
  const query = useQuery();

  const productId = query.get("productId") || "tee-001";
  const baseColor = query.get("color") || "#ffffff";
  const initialLogoUrl = query.get("logoUrl") || "";
  const mode = query.get("mode") || "logo"; // "logo" | "full"

  useEffect(() => {
    async function onMessage(e) {
      const allowedOrigin = new URL(DESIGNER_URL).origin;
      if (e.origin !== allowedOrigin) return;

      const { type, payload } = e.data || {};
      if (type === "DONE") {
        // 1) feltöltjük a képet a backendre (Cloudinary-n át)
        const resp = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/custom/upload`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageDataUrl: payload.imageDataUrl,
              productId: payload.productId,
            }),
          }
        );
        const { url } = await resp.json();

        // 2) navigálunk a kosárba és átadjuk a testreszabást
        history.push({
          pathname: "/cart",
          state: {
            customization: {
              productId: payload.productId,
              imageUrl: url,
              baseColor: payload.baseColor,
              isLogoTexture: payload.isLogoTexture,
              isFullTexture: payload.isFullTexture,
            },
          },
        });
      } else if (type === "CANCEL") {
        history.goBack();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [history]);

  function handleIframeLoad() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
      {
        type: "INIT",
        payload: { productId, baseColor, initialLogoUrl, mode },
      },
      new URL(DESIGNER_URL).origin
    );
  }

  return (
    <div style={{ height: "100vh", display: "grid" }}>
      <iframe
        ref={iframeRef}
        title="T-Shirt Designer"
        src={DESIGNER_URL}
        style={{ border: "none", width: "100%", height: "100%" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
