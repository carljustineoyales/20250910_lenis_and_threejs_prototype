"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Geometry, Base } from "@react-three/csg";
import { useLenis } from "../providers/LenisProvider";

const RotatingCube = () => {
  const meshRef = useRef();
  const lenis = useLenis();
  const lastScroll = useRef(0);
  const [state, setState] = useState({
    rotationX: 0,
    rotationY: 0,
    scale: 1,
  });

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }) => {
      const delta = scroll - lastScroll.current;
      lastScroll.current = scroll;

      setState((prev) => {
        // Rotation based on scroll delta
        const newRotationX = prev.rotationX + delta * 0.01;
        const newRotationY = prev.rotationY + delta * 0.01;

        // Scale increases/decreases based on scroll delta
        let newScale = prev.scale + delta * 0.002; // adjust sensitivity
        newScale = Math.max(0.5, Math.min(newScale, 2)); // clamp between 0.5 and 2

        return {
          rotationX: newRotationX,
          rotationY: newRotationY,
          scale: newScale,
        };
      });
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.rotationX;
      meshRef.current.rotation.y = state.rotationY;
      meshRef.current.scale.set(state.scale, state.scale, state.scale);
    }
  }, [state]);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <Geometry>
        <Base scale={[2, 2, 2]}>
          <boxGeometry />
        </Base>
      </Geometry>
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas shadows>
        <color attach="background" args={["#1e1e1e"]} />
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />

        {/* Lights */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} />

        {/* Helpers */}
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />

        <RotatingCube />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
