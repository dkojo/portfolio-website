import { Link } from 'react-router'
import { contextFor } from '../lib/projects.js'
import Tag from './Tag.jsx'

// headingLevel: 'h2' when the cards sit directly under the page h1, 'h3' under a section h2
export default function ProjectCard({ project, headingLevel: Heading = 'h2' }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="card flex min-w-0 flex-col gap-3 p-6 text-ink no-underline transition hover:border-accent motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className="label">{project.category}</span>
        {project.pipeline && (
          <span className="whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent">Live pipeline</span>
        )}
      </div>
      <Heading className="m-0 text-xl leading-tight font-extrabold">{project.title}</Heading>
      <span className="text-[17px] font-extrabold text-accent">{project.result}</span>
      <span className="font-mono text-[12.5px] text-muted">{contextFor(project)}</span>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {project.tags.slice(0, 4).map((t) => <Tag key={t} name={t} />)}
      </div>
    </Link>
  )
}
