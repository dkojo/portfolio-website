import { useState } from 'react'
import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import projects from '../data/projects.json'
import { container } from '../lib/ui.js'

const categories = [...new Set(projects.map((p) => p.category))]

export default function Projects() {
  const [active, setActive] = useState(null)
  const shown = active ? projects.filter((p) => p.category === active) : projects
  const chips = [{ name: null, label: 'All', count: projects.length }].concat(
    categories.map((c) => ({ name: c, label: c, count: projects.filter((p) => p.category === c).length })),
  )

  return (
    <>
      <section className={`${container} pt-14 md:pt-20`}>
        <PageHeader eyebrow="Work" title={`${projects.length} projects, and what each one changed`}>
          Case studies from Data Service Group, Stunnerz Global and the Ghana Revenue Authority, plus my own EKS platform build.
          Employer systems are private, so each case study covers the problem, approach and result rather than code.
        </PageHeader>

        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2.5">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={active === c.name}
              onClick={() => setActive(c.name)}
              className="min-h-11 cursor-pointer rounded-full border-[1.5px] border-line bg-bg px-4 text-[14.5px] font-semibold text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:font-bold aria-pressed:text-accent-ink"
            >
              {c.label}
              <span className="ml-1.5 font-mono text-xs opacity-70">{c.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`${container} pt-8 pb-20`}>
        <div className="grid gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      <section className={`${container} pb-24`}>
        <CtaBand title="Need results like these on your platform?" text="Tell me what you’re working on. I reply within one business day." />
      </section>
    </>
  )
}
