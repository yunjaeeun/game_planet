import React from "react";

const SpaceBase = ({ position, color, width, height, depth, visible }) => {
  if (!visible) return null;

  return (
    <mesh position={position}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

export default SpaceBase;
