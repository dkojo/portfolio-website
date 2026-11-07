import PageHeader from '../components/PageHeader.jsx'
import experience from '../data/experience.json'
import profile from '../data/profile.json'
import { btnGhost, btnPrimary, card, sectionWrap } from '../lib/ui.js'

const label = 'mt-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-accent'

export default function Resume() {
  const earned = profile.certifications.filter((c) => c.status === 'earned')
  const pending = profile.certifications.filter((c) => c.status !== 'earned')

  return (
    <section className={sectionWrap}>
      <PageHeader eyebrow="Resume" title="Resume and education" />

      <div className="grid items-start gap-12 md:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-3 rounded-md border border-line bg-surface p-5 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)] sm:p-8" aria-label="Resume summary">
          <div>
            <div className="font-display text-2xl font-extrabold [font-stretch:115%]">{profile.name}</div>
            <div className="font-mono text-xs text-muted">{profile.title} · {profile.location} · {profile.email}</div>
          </div>
          <hr className="border-line" />
          <div className={label}>Summary</div>
          <p className="text-sm text-muted">{profile.summary}</p>
          <div className={label}>Experience</div>
          {experience.map((job) => (
            <div key={job.id} className="flex flex-col justify-between gap-x-3 text-sm sm:flex-row">
              <b className="font-semibold">{job.role} · {job.short}</b>
              <span className="whitespace-nowrap font-mono text-xs text-muted">{job.start} – {job.end}</span>
            </div>
          ))}
          <div className={label}>Certifications</div>
          <ul className="grid list-disc gap-1 pl-4 text-sm text-muted">
            {earned.map((c) => <li key={c.name}>{c.name}</li>)}
            <li>In progress: {pending.map((c) => c.name).join(', ')}</li>
          </ul>
        </div>

        <div className="grid gap-4.5">
          <p className="text-muted">The full resume has every role, tool and result.</p>
          <div className="flex flex-wrap gap-3">
            <a href={profile.resume} download className={btnPrimary}>Download PDF</a>
            <a href={profile.resume} target="_blank" rel="noopener" className={btnGhost}>Open in a new tab</a>
          </div>
          <h2 className="mt-2 text-lg font-bold">Education</h2>
          <ul className="grid gap-3">
            {profile.education.map((e) => (
              <li key={e.degree} className={`${card} grid gap-0.5 px-3.5 py-3`}>
                <b className="font-semibold">{e.degree}</b>
                <span className="text-sm text-muted">{e.school}</span>
                <span className="font-mono text-xs text-muted">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
