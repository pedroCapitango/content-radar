import { useEffect, useState } from 'react'

const QUERY = '(max-width: 1024px)'

export default function useIsCompact() {
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const media = window.matchMedia(QUERY)
    const update = () => setIsCompact(media.matches)
    update()

    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isCompact
}
