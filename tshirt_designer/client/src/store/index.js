import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#301934",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./logo.png",
  fullDecal: "./logo.png",
  preview: false,
  size: "M",

  // Logó pozíció és méret
  logoPosition: { x: 0, y: 0.05, z: 0.15 },
  logoScale: 0.15,
  isDraggingLogo: false,
});

export default state;
