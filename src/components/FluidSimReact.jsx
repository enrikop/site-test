import React, { useRef, useEffect } from "react";
import { initFluidSim } from "./FluidSimReactCode";

export default function FluidSim() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initFluidSim(canvasRef.current);
    return cleanup;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        display: "block"
      }}
    />
  );
}