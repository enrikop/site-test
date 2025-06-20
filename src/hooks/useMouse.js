import { useEffect, useState } from 'react'
import { Vector2 } from 'three'

export function useMouse() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = 1.0 - e.clientY / window.innerHeight
      setMouse({ x, y })
      
      // console.log('Mouse normalized:', mouseVec.x, mouseVec.y);
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return mouse
}