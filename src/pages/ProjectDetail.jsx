import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router'
import ClientOnly from '../components/ClientOnly.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Icon from '../components/Icon.jsx'
import Tag from '../components/Tag.jsx'
import projects from '../data/projects.json'
import { contextFor } from '../lib/projects.js'
import NotFound from './NotFound.jsx'

// The live diagram is only needed on one page, so it loads in its own chunk
const PipelineDiagram = lazy(() => import('../components/pipeline/PipelineDiagram.jsx'))
const ChangesTable = lazy(() => import('../components/pipeline/ChangesTable.jsx'))

// Same height as the diagram's first frame, so nothing jumps when it loads
const diagramPlaceholder = (
  <div className="grid h-[420px] place-items-center rounded-3xl border border-line bg-surface text-muted">Loading the pipeline diagram…</div>
)

function StoryCard({ title, children }) {
  return (
    <article className="card flex flex-col gap-3 p-8">
      <h2 className="eyebrow m-0">{title}</h2>
      <p className="m-0 text-[16.5px]">{children}</p>
    </article>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return <NotFound />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]
  const wrap = `mx-auto px-5 sm:px-8 ${p.pipeline ? 'max-w-[1280px]' : 'max-w-[1200px]'}`

  return (
    <article>
      <section className={`${wrap} flex flex-col gap-4.5 pt-10 pb-10 md:pt-14`}>
        <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-bold text-accent">
          <Icon name="back" size={16} strokeWidth={2.4} /> All projects
        </Link>
        <span className="eyebrow">{p.category} · {contextFor(p)}</span>
        <h1 className="m-0 max-w-[20ch] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.04] font-extrabold tracking-[-0.035em]">{p.title}</h1>
        <p className="m-0 max-w-[64ch] text-lg text-muted md:text-[19px]">{p.summary}</p>
        <div className="mt-1.5 flex flex-wrap gap-3">
          {(p.highlights ?? [p.result]).map((h) => (
            <span key={h} className="rounded-xl bg-accent-soft px-3.5 py-2 text-[15px] font-bold text-accent">{h}</span>
          ))}
        </div>
      </section>

      {p.pipeline && (
        <section className={`${wrap} pb-16`}>
          <ClientOnly fallback={diagramPlaceholder}>
            <Suspense fallback={diagramPlaceholder}>
              <PipelineDiagram repo={p.pipelineRepo} />
            </Suspense>
          </ClientOnly>
        </section>
      )}

      <section className="border-y border-line bg-soft">
        <div className={`${wrap} grid gap-6 py-16 md:grid-cols-3 md:py-20`}>
          <StoryCard title="Problem">{p.problem}</StoryCard>
          <StoryCard title="Solution">{p.solution}</StoryCard>
          <StoryCard title="Outcome">{p.outcome}</StoryCard>
        </div>
      </section>

      <section className={`${wrap} grid gap-6 py-16 ${p.pipeline ? '' : 'lg:grid-cols-[1.4fr_1fr]'}`}>
        {!p.pipeline && (
          <div className="card flex flex-col gap-4 p-8">
            <h2 className="eyebrow m-0">Architecture</h2>
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-sm">
              {p.flow.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-muted">→</span>}
                  <span className="rounded-lg border border-line bg-soft px-3 py-1.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="card flex flex-col gap-4 p-8">
          <h2 className="eyebrow m-0">Tools</h2>
          <div className="flex flex-wrap gap-2">{p.tags.map((t) => <Tag key={t} name={t} />)}</div>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener" className="btn btn-primary mt-2 self-start">
              <Icon name="github" size={18} /> View the code on GitHub
            </a>
          )}
        </div>
      </section>

      {p.pipeline && (
        <ClientOnly>
          <Suspense fallback={null}>
            <section className={`${wrap} pb-16`}>
              <ChangesTable />
            </section>
          </Suspense>
        </ClientOnly>
      )}

      <section className={`${wrap} flex flex-col gap-8 pb-24`}>
        <CtaBand
          title={p.pipeline ? 'Want a pipeline like this for your team?' : 'Need a result like this on your platform?'}
          text={p.pipeline ? 'I can walk you through it on a call, or build it on your platform.' : 'Tell me what you’re working on. I reply within one business day.'}
        />
        <Link to={`/projects/${next.id}`} className="flex flex-col gap-1 border-t border-line pt-6 no-underline">
          <span className="label">Next project</span>
          <span className="inline-flex items-center gap-2 text-[22px] font-extrabold text-ink hover:text-accent">
            {next.title} <Icon name="arrow" size={20} strokeWidth={2.4} />
          </span>
        </Link>
      </section>
    </article>
  )
}
