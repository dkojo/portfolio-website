import { Link } from 'react-router'
import profile from '../data/profile.json'

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {profile.title} · {profile.location}
      </div>
      <h1 className="mt-3.5 mb-4.5 text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold leading-[1.05] tracking-tight [font-stretch:118%]">
        {profile.name}
      </h1>
      <p className="max-w-[54ch] text-lg text-muted">{profile.tagline}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link to="/projects" className="rounded-lg bg-accent px-4.5 py-2.5 font-semibold text-accent-ink no-underline hover:brightness-110">
          View projects
        </Link>
        <Link to="/resume" className="rounded-lg border border-line px-4.5 py-2.5 font-semibold text-ink no-underline hover:bg-code">
          Download resume
        </Link>
        <Link to="/contact" className="rounded-lg border border-line px-4.5 py-2.5 font-semibold text-ink no-underline hover:bg-code">
          Contact me
        </Link>
      </div>
    </section>
  )
}
