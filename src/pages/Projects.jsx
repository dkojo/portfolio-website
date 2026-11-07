import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import projects from '../data/projects.json'
import { sectionWrap } from '../lib/ui.js'

const categories = [...new Set(projects.map((p) => p.category))]

export default function Projects() {
  const [active, setActive] = useState(null)
  const shown = active ? projects.filter((p) => p.category === active) : projects
  const chips = [{ name: null, label: 'All', count: projects.length }].concat(
    categories.map((c) => ({ name: c, label: c, count: projects.filter((p) => p.category === c).length })),
  )

  return (
    <section className={sectionWrap}>
      <PageHeader eyebrow="Projects" title="Hands-on DevOps work">
        Case studies from Data Service Group, Stunnerz Global and the Ghana Revenue Authority, plus my own platform build.
        Employer systems are private, so those cards describe the problem, approach and result instead of linking to code.
      </PageHeader>

      <div role="group" aria-label="Filter by category" className="mb-6.5 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            aria-pressed={active === c.name}
            onClick={() => setActive(c.name)}
            className="cursor-pointer rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
          >
            {c.label}
            <span className="ml-1 font-mono text-xs opacity-70">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}
