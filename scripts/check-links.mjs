// Fails the build if any page in dist/ links to, or loads, a site path that doesn't exist.
// Mirrors how CloudFront serves the site: /about → about/index.html. External links are not checked,
// since sites like LinkedIn block automated requests and would make CI fail at random.
import { existsSync, statSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(entries.map((e) => {
    const path = join(dir, e.name)
    if (e.isDirectory()) return htmlFiles(path)
    return e.name.endsWith('.html') ? [path] : []
  }))
  return nested.flat()
}

// Same rule as infra/functions/viewer-request.js: a real file, or a directory holding index.html
function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]).replace(/^\/+/, '')
  const target = join(dist, clean)
  if (clean && existsSync(target) && statSync(target).isFile()) return true
  return existsSync(join(target, 'index.html'))
}

const pages = await htmlFiles(dist)
const broken = []
let checked = 0

for (const file of pages) {
  const html = await readFile(file, 'utf8')
  // href/src/srcset values that are site paths (start with a single "/")
  const refs = [...html.matchAll(/\s(?:href|src)="(\/(?!\/)[^"]*)"/g)].map((m) => m[1])
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/gi)) {
    refs.push(...m[1].split(',').map((s) => s.trim().split(/\s+/)[0]).filter((u) => u.startsWith('/')))
  }
  for (const ref of new Set(refs)) {
    checked++
    if (!resolves(ref)) broken.push(`${relative(dist, file)} → ${ref}`)
  }
}

if (broken.length) {
  console.error(`Broken internal links (${broken.length}):\n  ${broken.join('\n  ')}`)
  process.exit(1)
}
console.log(`Checked ${checked} internal links across ${pages.length} pages: all resolve.`)
