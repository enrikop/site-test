import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const FluidMat = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 st = vUv * uResolution / min(uResolution.x, uResolution.y);
      float d = length(st - uMouse / min(uResolution.x, uResolution.y));
      float wave = sin(uTime * 0.8 + d * 15.0) * 0.5 + 0.5;
      vec3 color = mix(vec3(0.13,0.25,0.48), vec3(0.89,0.98,1.0), wave);
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

export default function FluidShader() {
  const mesh = useRef()
  const mat = useRef()
  const { size } = useThree()
  const [dimensions, setDimensions] = useState([2, 2])

  useEffect(() => {
    function handleResize() {
      setDimensions([size.width, size.height])
      if (mat.current) {
        mat.current.uResolution = new THREE.Vector2(size.width, size.height)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [size])

  useFrame((state) => {
    if (mat.current) {
      mat.current.uTime = state.clock.getElapsedTime()
      mat.current.uResolution = new THREE.Vector2(size.width, size.height)
    }
  })

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (mat.current)
        mat.current.uMouse = new THREE.Vector2(e.clientX, size.height - e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size.height])

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={dimensions} />
      <fluidMat ref={mat} attach="material" />
    </mesh>
  )
}

FluidShader.Material = FluidMat
