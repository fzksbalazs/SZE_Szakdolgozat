import React, { useRef } from "react";
import { useSnapshot } from "valtio";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF("/shirt_baked.glb");
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const meshRef = useRef();

  return (
    <group>
      <mesh ref={meshRef} castShadow geometry={nodes.T_Shirt_male.geometry} dispose={null}>
        {/* alapanyag */}
        <meshStandardMaterial color={snap.color} roughness={1} metalness={0.3} />

        {/* teljes minta (háttér) */}
        {snap.isFullTexture && fullTexture && (
          <Decal
            position={[0, 0, 0.02]}       // nagyon enyhén a felszín elé
            rotation={[0, 0, 0]}
            scale={1.2}                   // nagyobb, hogy biztosan lefedjen
            map={fullTexture}
            depthTest={true}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            renderOrder={1}
          />
        )}

        {/* logó (mindig fölötte) */}
        {snap.isLogoTexture && logoTexture && (
          <Decal
            position={[0, 0.04, 0.16]}     // egy kicsit előrébb, mint a minta
            rotation={[0, 0, 0]}
            scale={0.18}
            map={logoTexture}
            transparent
            depthTest={true}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-5}
            renderOrder={2}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
