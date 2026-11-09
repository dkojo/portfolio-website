import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import profile from '../data/profile.json'
import { metaFor } from '../lib/meta.js'
import { container } from '../lib/ui.js'
import Icon from './Icon.jsx'
import LogoTile from './LogoTile.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/#services', label: 'Services', hash: true },
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
]

const initials = profile.name.split(' ').filter((w, i, a) => i === 0 || i === a.length - 1).map((w) => w[0]).join('')
// Fixed at build time so the pre-rendered HTML and the browser render agree
const year = __BUILD_YEAR__

function Monogram({ size = 'size-10 text-[15px]' }) {
  return <span className={`grid place-items-center rounded-[11px] bg-accent font-extrabold text-accent-ink ${size}`}>{initials}</span>
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  const onContact = pathname.startsWith('/contact')
  // These pages sit on the soft background, so it continues down to the footer on tall screens
  const softPage = onContact || pathname.startsWith('/resume')

  // Start each page at the top, like a normal multi-page site; links with a #section scroll to it instead.
  // Block body on purpose: newer browsers return a Promise from scrollTo, and React would treat it as a cleanup function
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  // Keep the tab title and description right after client-side navigation (the build writes them for first load)
  useEffect(() => {
    const { title, description } = metaFor(pathname)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-40 rounded-md bg-accent px-4 py-2 font-semibold text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className={`${container} flex h-[72px] items-center gap-2.5 sm:gap-6`}>
          <Link to="/" className="flex shrink-0 items-center gap-3 font-extrabold text-ink no-underline">
            <Monogram />
            <span className="hidden text-[17px] tracking-tight sm:inline">{profile.shortName}</span>
          </Link>
          <nav aria-label="Main" className="ml-auto flex min-w-0 gap-0 overflow-x-auto [scrollbar-width:none] sm:gap-4">
            {links.map((l) =>
              l.hash ? (
                <Link key={l.to} to={l.to} className="whitespace-nowrap px-[5px] py-2.5 text-[14px] sm:px-1.5 sm:text-[15px] font-semibold text-muted no-underline hover:text-ink">
                  {l.label}
                </Link>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap px-[5px] py-2.5 text-[14px] sm:px-1.5 sm:text-[15px] font-semibold no-underline hover:text-ink ${isActive ? 'text-ink' : 'text-muted'}`
                  }
                >
                  {l.label}
                </NavLink>
              ),
            )}
          </nav>
          <ThemeToggle />
          <Link to="/contact" className="btn btn-primary hidden min-h-11 text-[15px] md:inline-flex">Let’s talk</Link>
        </div>
      </header>

      <main id="main" tabIndex={-1} className={`flex-1 outline-none ${softPage ? 'bg-soft' : ''} ${onContact ? '' : 'pb-20 md:pb-0'}`}>
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className={`${container} flex flex-wrap items-center gap-x-8 gap-y-5 py-10 ${onContact ? '' : 'pb-28 md:pb-10'}`}>
          <span className="flex items-center gap-3 font-extrabold">
            <Monogram size="size-[34px] text-[13px]" />
            {profile.name}
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-muted">
            <Link to="/projects" className="hover:text-ink">Work</Link>
            <Link to="/about" className="hover:text-ink">About</Link>
            <Link to="/skills" className="hover:text-ink">Skills</Link>
            <Link to="/resume" className="hover:text-ink">Resume</Link>
            <Link to="/contact" className="hover:text-ink">Contact</Link>
          </nav>
          <span className="flex items-center gap-2.5 text-sm text-muted md:ml-auto">
            <LogoTile small className="size-7 rounded-md" />
            Founder of {profile.company.name}
          </span>
          <span className="w-full text-[13.5px] text-muted">
            © {year} {profile.name} · Hosted on AWS · S3, CloudFront, Route 53 · deployed by GitHub Actions
          </span>
        </div>
      </footer>

      {/* Phones: the main action stays within thumb reach while scrolling */}
      {!onContact && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2.5 border-t border-line bg-bg px-4 py-3 shadow-[0_-10px_30px_-18px_rgb(23_17_42/0.4)] md:hidden">
          <Link to="/contact" className="btn btn-primary min-h-12 flex-1">Message me</Link>
          <a href={profile.resume} download className="btn btn-ghost min-h-12 w-12 px-0" aria-label="Download resume">
            <Icon name="download" />
          </a>
        </div>
      )}
    </div>
  )
}
