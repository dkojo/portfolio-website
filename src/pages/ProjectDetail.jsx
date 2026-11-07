import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router'
import ClientOnly from '../components/ClientOnly.jsx'
import Tag from '../components/Tag.jsx'
import projects from '../data/projects.json'
import { contextFor } from '../lib/projects.js'
import { btnPrimary, eyebrow, sectionWrap } from '../lib/ui.js'
import NotFound from './NotFound.jsx'

// The live diagram is only needed on one page, so it loads in its own chunk
const PipelineDiagram = lazy(() => import('../components/pipeline/PipelineDiagram.jsx'))
const ChangesTable = lazy(() => import('../components/pipeline/ChangesTable.jsx'))

// Same height as the diagram's first frame, so nothing jumps when it loads
const diagramPlaceholder = (
  <div className="grid h-[420px] place-items-center rounded-xl border border-line bg-surface text-muted">Loading the pipeline diagram…</div>
)

function Block({ title, children }) {
  return (
    <div>
      <h2 className={`${eyebrow} mb-1.5 font-medium`}>{title}</h2>
      {children}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return <NotFound />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  return (
    <article className={p.pipeline ? 'mx-auto max-w-[1480px] px-4 py-16' : sectionWrap}>
      <Link to="/projects" className="mb-6 inline-block text-sm text-accent">← All projects</Link>

      <div className="mb-9 grid max-w-[65ch] gap-2">
        <div className={eyebrow}>{p.category} · {contextFor(p)}</div>
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight">{p.title}</h1>
        <div className="font-display text-xl font-bold text-accent [font-stretch:108%]">{p.result}</div>
        <p className="text-muted">{p.summary}</p>
      </div>

      {p.pipeline && (
        <div className="mb-12">
          <ClientOnly fallback={diagramPlaceholder}>
            <Suspense fallback={diagramPlaceholder}>
              <PipelineDiagram repo={p.pipelineRepo} />
            </Suspense>
          </ClientOnly>
        </div>
      )}

      <div className="grid max-w-[72ch] gap-7">
        <Block title="Problem"><p>{p.problem}</p></Block>
        <Block title="Solution"><p>{p.solution}</p></Block>
        {!p.pipeline && (
          <Block title="Architecture">
            <ol className="flex flex-wrap items-center gap-1.5 rounded-lg bg-code p-4 font-mono text-sm">
              {p.flow.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" className="text-muted">→</span>}
                  <span className="rounded-md border border-line bg-surface px-2.5 py-1.5">{step}</span>
                </li>
              ))}
            </ol>
          </Block>
        )}
        <Block title="Tools">
          <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <Tag key={t} name={t} />)}</div>
        </Block>
        <Block title="Outcome"><p>{p.outcome}</p></Block>
        {p.github && (
          <div><a href={p.github} target="_blank" rel="noopener" className={btnPrimary}>View the code on GitHub</a></div>
        )}
      </div>

      {p.pipeline && (
        <ClientOnly>
          <Suspense fallback={null}>
            <ChangesTable />
          </Suspense>
        </ClientOnly>
      )}

      <div className="mt-14 border-t border-line pt-6">
        <span className={eyebrow}>Next project</span>
        <Link to={`/projects/${next.id}`} className="mt-1 block font-display text-lg font-bold text-ink hover:text-accent">
          {next.title} →
        </Link>
      </div>
    </article>
  )
}
