import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import profile from '../data/profile.json'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
]

const initials = profile.name.split(' ').filter((w, i, a) => i === 0 || i === a.length - 1).map((w) => w[0]).join('')
const year = new Date().getFullYear()

export default function Layout() {
  const { pathname } = useLocation()

  // Start each page at the top, like a normal multi-page site
  // Block body on purpose: newer browsers return a Promise from scrollTo, and React would treat it as a cleanup function
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex h-15 max-w-6xl items-center gap-4 px-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-2 font-display text-[1.05rem] font-extrabold text-ink no-underline">
            <span className="grid size-7.5 place-items-center rounded-md bg-ink text-xs text-bg">{initials}</span>
            <span className="hidden sm:inline">{profile.shortName}</span>
          </NavLink>
          <nav aria-label="Main" className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.92rem] no-underline hover:bg-code hover:text-ink ${isActive ? 'bg-code text-ink' : 'text-muted'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-8 text-sm text-muted">
          <span>© {year} {profile.name}</span>
          <span className="font-mono">Hosted on AWS · S3 + CloudFront</span>
        </div>
      </footer>
    </div>
  )
}
