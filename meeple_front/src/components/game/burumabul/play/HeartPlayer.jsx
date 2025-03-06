import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HeartPlayer = ({ position, color, scale }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(performance.now() / 500) * 0.001;
      ref.current.rotation.y += 0.01;
    }
  });

  // 하트 모양 정의
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.3);
  shape.bezierCurveTo(0.3, 0.6, 0.7, 0.6, 1, 0.3);
  shape.bezierCurveTo(1.2, 0.1, 1, -0.2, 0.5, -0.5);
  shape.bezierCurveTo(0, -0.2, -0.2, 0.1, 0, 0.3);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.05,
  };
  return (
    <mesh ref={ref} position={position} scale={[scale, scale, scale]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default HeartPlayer;
