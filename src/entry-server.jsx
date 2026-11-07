// Build-only entry, never hot-reloaded, so exporting helpers next to render() is fine
// oxlint-disable react/only-export-components
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

export { metaFor, NOT_FOUND, ROUTES } from './lib/meta.js'

// Used at build time by scripts/prerender.mjs to turn each route into static HTML
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
