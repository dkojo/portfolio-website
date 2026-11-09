import { Link } from 'react-router'
import Icon from '../components/Icon.jsx'
import Tag from '../components/Tag.jsx'
import experience from '../data/experience.json'
import profile from '../data/profile.json'
import { container } from '../lib/ui.js'

const paperHead = 'mt-1.5 border-b-[1.5px] border-ink pb-1 font-mono text-[11px] tracking-[0.1em] text-accent uppercase'
const coreSkills = ['AWS', 'Terraform', 'Ansible', 'Kubernetes', 'OpenShift', 'Docker', 'Helm', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'ArgoCD', 'SonarQube', 'Snyk', 'Prometheus', 'Grafana', 'Datadog', 'Python', 'Bash', 'Linux']

export default function Resume() {
  const earned = profile.certifications.filter((c) => c.status === 'earned')
  const pending = profile.certifications.filter((c) => c.status !== 'earned')

  return (
    <div className="bg-soft">
      <section className={`${container} flex flex-wrap items-end justify-between gap-6 pt-14 pb-8 md:pt-16`}>
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <span className="eyebrow">Resume</span>
          <h1 className="m-0 text-[clamp(2.2rem,5vw,3.3rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">Everything in one file you can forward</h1>
          <p className="m-0 text-lg text-muted">{profile.resumeMeta}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={profile.resume} download className="btn btn-primary btn-lg"><Icon name="download" size={18} strokeWidth={2.2} /> Download PDF</a>
          <a href={profile.resume} target="_blank" rel="noopener" className="btn btn-ghost btn-lg bg-bg">Open in a new tab</a>
        </div>
      </section>

      <section className={`${container} grid items-start gap-8 pt-4 pb-24 lg:grid-cols-[1.25fr_1fr]`}>
        <article aria-label="Resume preview" className="flex flex-col gap-3 rounded-[10px] border border-line bg-white p-7 text-[#17112a] shadow-[0_30px_60px_-36px_rgb(23_17_42/0.35)] sm:px-13 sm:py-12">
          <div className="flex flex-col gap-0.5 text-center">
            <span className="text-[26px] font-extrabold tracking-[0.02em]">{profile.name.toUpperCase()}</span>
            <span className="text-base">Cloud | DevOps Engineer</span>
            <span className="mt-2 text-[12.5px] text-[#5a5570]">
              {profile.location.replace(', USA', ' – USA')} | {profile.phone} | <span className="text-[#5b21b6] underline">{profile.email}</span> | <span className="text-[#5b21b6] underline">danielkojomegbenu.com</span> | <span className="text-[#5b21b6] underline">LinkedIn</span>
            </span>
          </div>
          <span className={paperHead}>Summary</span>
          <p className="m-0 text-[13.5px]">{profile.summary}</p>
          <span className={paperHead}>Experience</span>
          {experience.map((job) => (
            <div key={job.id} className="flex flex-col justify-between gap-x-3 text-[13.5px] sm:flex-row">
              <b>{job.role} · {job.company}</b>
              <span className="font-mono text-xs whitespace-nowrap">{job.start} – {job.end}</span>
            </div>
          ))}
          <span className={paperHead}>Education</span>
          <span className="text-[13.5px]">{profile.education.slice(0, 2).map((e) => `${e.degree}, ${e.school.split(',')[0]}${e.date.startsWith('Expected') ? ` (${e.date.replace('Expected', 'expected')})` : ''}`).join(' · ')}</span>
          <span className={paperHead}>Certifications</span>
          <span className="text-[13.5px]">{earned.map((c) => c.name).join(' · ')} · in progress: {pending.map((c) => c.name.replace(/ \(.*\)$/, '')).join(', ')}</span>
          <span className="mt-2.5 text-center text-[13px] text-[#5a5570]">Preview of page 1 · download the PDF for all three pages</span>
        </article>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="card flex flex-col gap-3.5 p-6.5">
            <h2 className="m-0 text-lg font-extrabold">At a glance</h2>
            <dl className="m-0 grid grid-cols-2 gap-3.5">
              {profile.glance.map((g) => (
                <div key={g.label} className="flex flex-col-reverse">
                  <dt className="text-sm text-muted">{g.label}</dt>
                  <dd className="m-0 text-[28px] font-extrabold text-accent">{g.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card flex flex-col gap-3 p-6.5">
            <h2 className="m-0 text-lg font-extrabold">Core skills</h2>
            <div className="flex flex-wrap gap-2">{coreSkills.map((t) => <Tag key={t} name={t} />)}</div>
            <Link to="/skills" className="mt-1 text-[15px] font-bold text-accent">All skills by area →</Link>
          </div>
          <div className="card flex flex-col gap-2.5 p-6.5">
            <h2 className="m-0 text-lg font-extrabold">Work style</h2>
            <p className="m-0 text-muted">Full-time, contract or consulting through {profile.company.name}. {profile.workMode} from {profile.location.replace(', USA', '')}.</p>
            <Link to="/contact" className="btn btn-primary mt-1.5 self-start">Start a conversation</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
