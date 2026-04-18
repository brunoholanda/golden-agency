import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** Deve coincidir com o ID em `index.html` (gtag.js). */
const GA_MEASUREMENT_ID = 'G-Q8Q8R56HXC'

/**
 * Envia `page_view` no GA4 em navegações client-side (React Router).
 * A primeira página já é contabilizada pelo `gtag('config', …)` do HTML.
 */
export function GtagRouteListener() {
  const location = useLocation()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    const gtag = window.gtag
    if (typeof gtag !== 'function') return

    const pagePath = `${location.pathname}${location.search}${location.hash}`
    if (prevPathRef.current === pagePath) return

    const isInitialRoute = prevPathRef.current === null
    prevPathRef.current = pagePath
    if (isInitialRoute) return

    gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: document.title,
      page_location: `${window.location.origin}${pagePath}`,
    })
  }, [location.pathname, location.search, location.hash])

  return null
}
