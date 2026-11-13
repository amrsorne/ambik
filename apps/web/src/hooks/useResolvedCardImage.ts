import { useEffect, useState } from 'react'
import { DEFAULT_CARD_IMAGE } from '../constants/images'

function primaryImage(img?: string[]): string | undefined {
  const first = img?.[0]?.trim()
  return first || undefined
}

export function useResolvedCardImage(img?: string[]): string {
  const [resolved, setResolved] = useState(DEFAULT_CARD_IMAGE)
  const primary = img?.[0] ?? ''

  useEffect(() => {
    const candidate = primaryImage(img)
    if (!candidate) {
      setResolved(DEFAULT_CARD_IMAGE)
      return
    }

    const probe = new Image()
    probe.onload = () => setResolved(candidate)
    probe.onerror = () => setResolved(DEFAULT_CARD_IMAGE)
    probe.src = candidate

    return () => {
      probe.onload = null
      probe.onerror = null
    }
  }, [primary, img])

  return resolved
}
