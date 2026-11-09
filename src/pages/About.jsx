import CtaBand from '../components/CtaBand.jsx'
import LogoTile from '../components/LogoTile.jsx'
import experience from '../data/experience.json'
import profile from '../data/profile.json'
import { container } from '../lib/ui.js'

const pill = 'shrink-0 rounded-full px-2.5 py-1 text-[13px] font-bold'

export default function About() {
  return (
    <>
      <section className={`${container} grid items-center gap-14 pt-14 pb-16 md:grid-cols-[1.4fr_1fr] md:pt-20`}>
        <div className="flex min-w-0 flex-col gap-5">
          <span className="eyebrow">About me</span>
          <h1 className="m-0 text-[clamp(2.25rem,5vw,3.4rem)] leading-[1.06] font-extrabold tracking-[-0.035em]">From Linux servers in Ghana to cloud platforms in the US</h1>
          {profile.story.map((p) => <p key={p} className="m-0 max-w-[58ch] text-lg text-muted md:text-[18.5px]">{p}</p>)}
        </div>
        <picture className="mx-auto block aspect-[4/4.4] w-full max-w-[440px] overflow-hidden rounded-[28px] border border-line bg-soft">
          <source type="image/webp" srcSet="/daniel-megbenu-440.webp 440w, /daniel-megbenu-720.webp 720w" sizes="(min-width: 768px) 440px, calc(100vw - 40px)" />
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="720" height="900" className="size-full object-cover object-[50%_20%]" />
        </picture>
      </section>

      {/* Founder feature: the company's own navy and gold, framed by the site's layout */}
      <section className={`${container} pb-20`}>
        <div className="grid overflow-hidden rounded-[28px] bg-brand-navy text-[#f4f2fb] md:grid-cols-[1fr_1.3fr]">
          <LogoTile className="min-h-[260px] md:min-h-[340px]" alt={`${profile.company.name} logo`} />
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-13">
            <span className="font-mono text-[13px] tracking-[0.08em] text-brand-gold uppercase">Founder</span>
            <h2 className="m-0 text-[clamp(1.9rem,3.6vw,2.5rem)] leading-tight font-extrabold">{profile.company.name}</h2>
            <span className="text-xl font-semibold text-brand-gold">“{profile.company.slogan}”</span>
            <p className="m-0 max-w-[52ch] text-[17px] text-[#c9c4dd]">{profile.company.about}</p>
            <a href="/contact" className="btn mt-2 self-start bg-brand-gold text-brand-navy hover:brightness-105">Ask about a consulting engagement</a>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-soft">
        <div className={`${container} grid gap-14 py-20 lg:grid-cols-[1fr_2fr]`}>
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow">Experience</span>
            <h2 className="m-0 text-[clamp(1.9rem,3.6vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">From sysadmin to cloud engineer</h2>
            <p className="m-0 text-muted">Three roles, one thread: automating the work so systems stay up.</p>
          </div>
          <ol className="m-0 flex list-none flex-col gap-5 p-0">
            {experience.map((job) => (
              <li key={job.id} className="card grid gap-3 p-7 sm:grid-cols-[160px_1fr] sm:gap-6">
                <span className="font-mono text-sm font-medium text-accent tabular-nums">{job.start} – {job.end === 'Present' ? 'now' : job.end}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 text-[21px] font-extrabold">{job.role}</h3>
                  <span className="font-semibold text-muted">{job.company} · {job.location}</span>
                  <ul className="m-0 list-disc pl-5 text-muted">
                    {job.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${container} grid gap-10 py-20 md:grid-cols-2`}>
        <div className="flex flex-col gap-4.5">
          <h2 className="eyebrow m-0">Certifications</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {profile.certifications.map((c) => {
              const earned = c.status === 'earned'
              return (
                <li key={c.name} className={`card flex items-center justify-between gap-4 px-5.5 py-4.5 ${earned ? '' : 'border-dashed'}`}>
                  <span className="font-bold">{c.name}</span>
                  <span className={`${pill} ${earned ? 'bg-ok/15 text-ok' : 'bg-accent-soft text-accent'}`}>{earned ? 'Earned' : 'In progress'}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="flex flex-col gap-4.5">
          <h2 className="eyebrow m-0">Education</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {profile.education.map((e) => (
              <li key={e.degree} className="card flex flex-col gap-0.5 px-5.5 py-4.5">
                <span className="font-bold">{e.degree}</span>
                <span className="text-[15px] text-muted">{e.school} · {e.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${container} pb-24`}>
        <CtaBand title="Let’s talk about your platform" text={`Full-time, contract or consulting; ${profile.workMode.toLowerCase()}. A short message is all it takes to start.`} />
      </section>
    </>
  )
}
