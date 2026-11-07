import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import projects from '../data/projects.json'

export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <PageHeader eyebrow="Projects" title="Hands-on DevOps work">
        Case studies with architecture, tools and results.
      </PageHeader>
      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-line bg-surface p-5 text-ink no-underline hover:border-accent"
          >
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{p.category}</span>
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p className="text-[0.93rem] text-muted">{p.summary}</p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded bg-code px-2 py-0.5 font-mono text-xs">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
