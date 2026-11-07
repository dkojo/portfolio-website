import PageHeader from '../components/PageHeader.jsx'
import RichText from '../components/RichText.jsx'
import experience from '../data/experience.json'
import profile from '../data/profile.json'
import { sectionWrap } from '../lib/ui.js'

export default function About() {
  return (
    <section className={sectionWrap}>
      <PageHeader eyebrow="About me" title="From Linux servers in Ghana to cloud platforms in the US" />

      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div className="grid max-w-[60ch] content-start gap-3.5 text-muted">
          {profile.story.map((p) => <p key={p}><RichText text={p} /></p>)}

          <h2 className="mt-6 text-lg font-bold text-ink">Certifications</h2>
          <ul className="flex flex-wrap gap-2.5">
            {profile.certifications.map((c) => {
              const pending = c.status !== 'earned'
              return (
                <li
                  key={c.name}
                  className={`flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink ${pending ? 'border-dashed' : ''}`}
                >
                  {c.name}
                  <span className={`font-mono text-xs ${pending ? 'text-warn' : 'text-muted'}`}>{pending ? 'In progress' : c.issuer}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h2 className="sr-only">Experience</h2>
          <ol className="relative grid gap-6.5 before:absolute before:top-2 before:bottom-2 before:left-1.5 before:w-0.5 before:bg-line">
            {experience.map((job, i) => (
              <li key={job.id} className="relative pl-8">
                <span className={`absolute top-1.5 left-0 size-3.5 rounded-full border-2 border-accent ${i === 0 ? 'bg-accent' : 'bg-bg'}`} />
                <div className="font-mono text-sm text-muted tabular-nums">{job.start} – {job.end}</div>
                <h3 className="text-lg font-bold">{job.role}</h3>
                <div className="text-[0.93rem] text-muted">{job.company} · {job.location}</div>
                <ul className="mt-1.5 list-disc pl-4.5 text-[0.93rem] text-muted">
                  {job.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <h2 className="sr-only">Achievements</h2>
      <dl className="mt-12 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-surface lg:grid-cols-4">
        {profile.achievements.map((a, i) => (
          <div
            key={a.label}
            className={`flex flex-col-reverse p-5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''} border-line`}
          >
            <dt className="text-sm text-muted">{a.label}</dt>
            <dd className="font-display text-3xl font-bold text-accent tabular-nums [font-stretch:110%]">{a.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
