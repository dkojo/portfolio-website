// Turns the client build into one static HTML file per route, plus 404.html, sitemap.xml and robots.txt.
// Runs after `vite build` and `vite build --ssr`. Set SITE_URL (e.g. https://danielmegbenu.com) to add
// canonical URLs, absolute link-preview images and the sitemap.
import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '')

const { render, metaFor, NOT_FOUND, ROUTES } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href)
const built = await readFile(join(dist, 'index.html'), 'utf8')

// Content Security Policy, with a hash for each inline script so it stays correct when that script changes.
// Lives here rather than in CloudFront for that reason; CloudFront adds the other security headers.
const inlineHashes = [...built.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  ([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`,
)
const csp = [
  "default-src 'self'",
  `script-src 'self' https://cloud.umami.is ${inlineHashes.join(' ')}`, // Umami analytics
  "style-src 'self' 'unsafe-inline'", // React style attributes in the pipeline diagram
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io https://api.github.com https://cloud.umami.is https://gateway.umami.is", // contact form, live pipeline runs, Umami
  "form-action 'self' https://formspree.io",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')
const template = built.replace('<meta charset="UTF-8" />', () => `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`)

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const profile = JSON.parse(await readFile(join(root, 'src/data/profile.json'), 'utf8'))
const LAUNCHED = '2026-11-07T00:00:00Z' // first deploy of the site
const builtAt = new Date().toISOString()

function socialTags({ title, description }, path) {
  const tags = [
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', profile.name],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    // Author and dates: link-preview scrapers such as LinkedIn's Post Inspector look for these
    ['name', 'author', profile.name],
    ['property', 'article:author', profile.linkedin],
    ['property', 'article:published_time', LAUNCHED],
    ['property', 'article:modified_time', builtAt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]
  const links = []
  // Link previews and canonical URLs must be absolute, so they need the real domain
  if (siteUrl) {
    const url = siteUrl + (path === '/' ? '/' : path)
    tags.push(['property', 'og:url', url], ['property', 'og:image', `${siteUrl}/og-image.png`], ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'], ['property', 'og:image:alt', title], ['name', 'twitter:image', `${siteUrl}/og-image.png`])
    links.push(`<link rel="canonical" href="${escape(url)}" />`)
  }
  if (path === '/') links.push(personJsonLd())
  return [...tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escape(value)}" />`), ...links].join('\n    ')
}

// schema.org Person on the home page, so search engines can connect the site, LinkedIn and GitHub.
// JSON-LD isn't executed, so the CSP's script hashes don't apply to it.
function personJsonLd() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    address: { '@type': 'PostalAddress', addressLocality: 'Cincinnati', addressRegion: 'OH', addressCountry: 'US' },
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: profile.stack,
    ...(siteUrl && { url: `${siteUrl}/`, image: `${siteUrl}${profile.photo}` }),
  }
  return `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`
}

// Function replacers, so a "$" in page content is inserted as-is instead of read as a replace() pattern
function page(path, meta, html) {
  return template
    .replace(/<title>.*?<\/title>/s, () => `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, () => `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('<!--social-meta-->', () => socialTags(meta, path))
    .replace('<!--app-html-->', () => html)
}

for (const path of ROUTES) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(path, metaFor(path), render(path)))
}
await writeFile(join(dist, '404.html'), page('/404', NOT_FOUND, render('/404')))

const robots = ['User-agent: *', 'Allow: /']
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = ROUTES.map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
  await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
  robots.push(`Sitemap: ${siteUrl}/sitemap.xml`)
}
await writeFile(join(dist, 'robots.txt'), robots.join('\n') + '\n')

await rm(serverDir, { recursive: true, force: true })
console.log(`Pre-rendered ${ROUTES.length} pages + 404.html${siteUrl ? ` and sitemap.xml for ${siteUrl}` : ' (set SITE_URL for sitemap, canonical and og:image)'}`)
