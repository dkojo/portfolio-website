import { Link } from 'react-router'
import { contextFor } from '../lib/projects.js'
import { card, eyebrow } from '../lib/ui.js'
import Tag from './Tag.jsx'

// headingLevel: 'h2' when the cards sit directly under the page h1, 'h3' under a section h2
export default function ProjectCard({ project, headingLevel: Heading = 'h2' }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`${card} flex min-w-0 flex-col gap-3 p-5 text-ink no-underline transition hover:border-accent motion-safe:hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={eyebrow}>{project.category}</span>
        {project.caseStudy && (
          <span className="whitespace-nowrap rounded border border-accent px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide text-accent">
            Case study
          </span>
        )}
      </div>
      <Heading className="text-lg font-bold leading-snug">{project.title}</Heading>
      <div className="font-display font-bold text-accent [font-stretch:108%]">{project.result}</div>
      <p className="text-[0.93rem] text-muted">{project.summary}</p>
      <span className="font-mono text-xs text-muted">{contextFor(project)}</span>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.tags.map((t) => <Tag key={t} name={t} />)}
      </div>
    </Link>
  )
}
