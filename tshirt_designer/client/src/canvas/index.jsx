import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";

import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 0], fov: 28 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full max-w-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
       <Backdrop />

      <CameraRig>
       
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
