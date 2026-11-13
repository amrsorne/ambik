import { useEffect, useRef } from 'react'

/** Drives --angle for conic-gradient borders (dev.to rotating glow pattern). */
export function useRotatingGlowAngle<T extends HTMLElement>(
  enabled: boolean,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    let angle = 0
    let frameId = 0

    const tick = () => {
      angle = (angle + 1) % 360
      el.style.setProperty('--angle', `${angle}deg`)
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [enabled])

  return ref
}
