"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Text, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function ButtonModel({ position, textPosition, day, color, theme }) {
  const { scene } = useGLTF("/glb/button2.glb");
  const router = useRouter();
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  const handleModelClick = () => {
    router.push(`/quizes/${encodeURIComponent(theme)}`);
  };

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone();
      child.material.color.set(color);
    }
  });

  return (
    <>
      <group
        ref={modelRef}
        position={position}
        scale={hovered ? 1.6 : 1.5}
        onClick={handleModelClick} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene.clone()} />
      </group>
      <Text
        position={textPosition}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {day}
      </Text>
    </>
  );
}

export default function ButtonScene() {
  const today = new Date();

  const themes = [
    "Onboarding Questions",
    "Transportation & Diet",
    "Energy, Transport & Shopping",
    "Energy, Diet & Plastic Use",
    "Home Energy & Lifestyle",
    "Transportation & Food Choices",
    "Water Conservation & Home Efficiency",
  ];

  const buttonData = themes.map((theme, index) => {
    const date = new Date();
    date.setDate(today.getDate() + index); 
    return {
      position: [-17 + index * 5, index % 2 === 0 ? 2 : -2, 0],
      textPosition: [-16 + index * 5, index % 2 === 0 ? 5 : -6, 0],
      day: date.toLocaleDateString(),
      color: `hsl(${index * 40}, 70%, 70%)`,
      theme,
    };
  });

  return (
    <div className="w-screen h-screen">
      <Canvas
        camera={{ position: [0, 25, 30], fov: 45 }}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          {buttonData.map(({ position, textPosition, day, color, theme }, index) => (
            <ButtonModel
              key={index}
              position={position}
              textPosition={textPosition}
              day={day}
              color={color}
              theme={theme}
            />
          ))}
        </Suspense>
        <OrbitControls enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
