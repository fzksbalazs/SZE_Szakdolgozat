import Canvas from "./canvas"
import Customizer from "./pages/Customizer"
import { useEffect } from "react";
import state from "./store"; // nálad már van valtio store
import Home from "./pages/Home";
import { useSnapshot } from "valtio";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  const snap = useSnapshot(state);
  
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "preview") {
    state.preview = true;
    state.intro = false;
  }
}, []);


   useEffect(() => {
    function onMessage(e) {
      const allowedOrigins = [
        "http://localhost:3000",           // webshop lokál
        "https://wearable-3d.vercel.app",  
      ];
      if (!allowedOrigins.includes(e.origin)) return;

      const { type, payload } = e.data || {};
      if (type === "INIT") {
        // állítsd be a kezdő állapotot a message-ből
        if (payload.baseColor) state.color = payload.baseColor;
        if (payload.mode === "logo") {
          state.isLogoTexture = true;
          state.isFullTexture = false;
        } else if (payload.mode === "full") {
          state.isLogoTexture = false;
          state.isFullTexture = true;
        }
        if (payload.initialLogoUrl) {
          state.logoDecal = payload.initialLogoUrl;
        }
        state.productId = payload.productId || "tee-001";

        if (payload.mode === "preview") {
          state.preview = true;
          state.intro = false;
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
     <Router>
     <main className="transition-all ease-in app">
      {snap.preview ? (
        // csak preview → csak a póló
        <Canvas />
      ) : (
        <>
          <Home />
          <Canvas />
          <Customizer />
        </>
      )}
    </main>
    </Router>
  )
}

export default App
