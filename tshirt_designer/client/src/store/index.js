import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#E882C6",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});

export default state;
