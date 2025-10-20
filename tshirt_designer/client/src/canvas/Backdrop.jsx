import React, { useRef } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";

const Backdrop = () => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500); // 1,5s késleltetés
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <AccumulativeShadows
      temporal ={false}
      frames={150}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  );
};


export default Backdrop;
