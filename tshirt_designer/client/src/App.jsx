import Canvas from "./canvas"
import Customizer from "./pages/Customizer"
import Home from "./pages/home"
import { useEffect } from "react";
import state from "./store"; // nálad már van valtio store

function App() {
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
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="app trarnsition-all-ease-in">
      <Home></Home>
      <Canvas></Canvas>
      <Customizer></Customizer>

    </main>
  )
}

export default App
