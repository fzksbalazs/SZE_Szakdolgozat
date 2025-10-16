import React from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF("/shirt_baked.glb");

  const logoTexture = useTexture(snap.logoDecal);
  const FullTexture = useTexture(snap.fullDecal);

  useFrame(({ clock }) => {
    const mesh = nodes.T_Shirt_male;
    if (mesh) mesh.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group>
      <mesh castShadow geometry={nodes.T_Shirt_male.geometry} dispose={null}>
        <meshStandardMaterial
          color={snap.color} // use Valtio state for dynamic tint
          roughness={1}
          metalness={0.3}
        />

        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={FullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;