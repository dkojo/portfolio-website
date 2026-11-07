import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// Renders `fallback` in the pre-rendered HTML and during hydration, then `children` in the browser.
// For browser-only parts (the animated pipeline): React would otherwise report the server HTML as a failed render.
export default function ClientOnly({ children, fallback = null }) {
  const inBrowser = useSyncExternalStore(subscribe, () => true, () => false)
  return inBrowser ? children : fallback
}
