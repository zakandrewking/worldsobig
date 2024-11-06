// adapted from https://github.com/theshanergy/solarsystem

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";

import Scene from "./Scene";

// App component
const SolarSystem = () => (
  <div className="h-full w-full" id="1234">
    <div className="fixed bottom-0 right-0 text-white text-sm z-50 p-4">
      Credit{" "}
      <a href="https://github.com/theshanergy/solarsystem" target="_blank">theshanergy</a>
    </div>
    <Canvas camera={{ position: [0, 50, 150], far: 200000 }}>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.25} />

      <OrbitControls maxDistance={450} minDistance={50} makeDefault />

      <Physics gravity={[0, 0, 0]}>
        <Scene />
      </Physics>

      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  </div>
);

export default SolarSystem;
