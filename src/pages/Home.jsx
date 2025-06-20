import React from 'react'
import { Canvas } from '@react-three/fiber'

import FluidSim from '../components/FluidSimReact'
// extend({ FluidMat: FluidShader.Material })


export default function Home() {
  return (
    <main>
      {/* Hero3D layer 3D */}

        <FluidSim />

      {/* <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          pointerEvents: "none"
        }}
      >
        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 7rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#232323",
          margin: 0,
          textShadow: "0 2px 10px rgba(0,0,0,0.06)"
        }}>
          Enrico Pasetti
        </h1>
        <p style={{
          fontSize: "clamp(1.1rem, 2vw, 2.2rem)",
          color: "#232323b0",
          marginTop: "1.3rem",
          fontWeight: 400,
          letterSpacing: "0.01em"
        }}>
          I craft visual experiences
        </p>
      </div> */}
    </main>
  )
}

