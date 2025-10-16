import * as THREE from "three";

/**
 * Exportálja a pólót PNG-be
 * @param {THREE.Scene} scene - a Three.js jelenet
 * @param {THREE.Camera} camera - a Three.js kamera
 * @param {number} width - exportált kép szélessége
 * @param {number} height - exportált kép magassága
 * @returns {string} - base64 PNG
 */
export const exportShirtToPNG = (scene, camera, width = 1024, height = 1024) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height);

  // Rendereljük a pólót
  renderer.render(scene, camera);

  const dataURL = renderer.domElement.toDataURL("image/png");

  // Opcionális letöltés
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "shirt.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataURL;
};
