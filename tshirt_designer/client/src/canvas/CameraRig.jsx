import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [rotationStartTime, setRotationStartTime] = useState(0);

  useFrame((r3fState, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

  
    let targetPosition = [0, 0, 2.5];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2.5];
      if (isMobile) targetPosition = [0, 0.2, 3];
    }

    easing.damp3(r3fState.camera.position, targetPosition, 0.25, delta);

    if (isPreviewing) {
      const elapsed = r3fState.clock.getElapsedTime() - rotationStartTime;
      const t = Math.min(elapsed / 5, 1); 
      group.current.rotation.y = Math.PI * 2 * t;

      if (t >= 1) {
        setIsPreviewing(false);
        group.current.rotation.y = 0; 
      }
    } else {
      
      easing.dampE(
        group.current.rotation,
        [r3fState.pointer.y / 10, -r3fState.pointer.x / 5, 0],
        0.25,
        delta
      );
    }
  });

 
  useEffect(() => {
    state.startPreview = () => {
      setRotationStartTime(performance.now() / 1000);
      setIsPreviewing(true);
    };
    return () => {
   
      state.startPreview = null;
    };
  }, []);

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
