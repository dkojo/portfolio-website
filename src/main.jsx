import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Production pages arrive pre-rendered, so attach to that HTML. The dev server's root holds only the
// <!--app-html--> placeholder comment, so check for elements rather than any child node.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
