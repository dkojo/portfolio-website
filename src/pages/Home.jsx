import { Link } from 'react-router'
import ContactForm from '../components/ContactForm.jsx'
import Icon from '../components/Icon.jsx'
import LogoTile from '../components/LogoTile.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import RichText from '../components/RichText.jsx'
import Tag from '../components/Tag.jsx'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import { container } from '../lib/ui.js'

const featured = projects.filter((p) => p.featured)
const lead = featured.find((p) => p.pipeline) ?? featured[0]
const others = featured.filter((p) => p !== lead).slice(0, 2)
const floatingCard = 'card absolute shadow-[0_18px_40px_-18px_rgb(23_17_42/0.35)]'

function Hero() {
  return (
    <section id="top" className={`${container} grid items-center gap-14 pt-14 pb-16 md:grid-cols-[1.25fr_1fr] md:gap-16 md:pt-20 md:pb-20`}>
      <div className="flex min-w-0 flex-col gap-6">
        <span className="inline-flex items-center gap-2.5 self-start rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-bold text-accent">
          <span className="size-2 rounded-full bg-[#16a34a]" />
          {profile.availability}
        </span>
        <span className="eyebrow">{profile.title} · {profile.location.replace(', USA', '')}</span>
        <h1 className="m-0 text-[clamp(2.5rem,6vw,3.9rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          <RichText text={profile.headline} strongClassName="font-extrabold text-accent" />
        </h1>
        <p className="m-0 max-w-[54ch] text-lg text-muted md:text-[19px]">{profile.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-3.5">
          <Link to="/contact" className="btn btn-primary btn-lg">
            Start a conversation <Icon name="arrow" size={18} strokeWidth={2.4} />
          </Link>
          <a href={profile.resume} download className="btn btn-ghost btn-lg">
            <Icon name="download" size={18} /> Download resume
          </a>
        </div>
        <p className="m-0 text-sm text-muted">Replies within {profile.replyTime} · Open to {profile.workMode.toLowerCase()} roles</p>
      </div>

      <div className="relative mx-auto w-full max-w-[460px] min-w-0">
        {/* WebP at the two sizes the card is shown at; the JPEG stays as the fallback */}
        <picture className="block aspect-[4/4.6] overflow-hidden rounded-[28px] border border-line bg-soft">
          <source type="image/webp" srcSet="/daniel-megbenu-440.webp 440w, /daniel-megbenu-720.webp 720w" sizes="(min-width: 768px) 460px, calc(100vw - 40px)" />
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="720" height="900" fetchPriority="high" className="size-full object-cover object-[50%_20%]" />
        </picture>
        {profile.heroStats.map((s, i) => (
          <div key={s.label} className={`${floatingCard} flex flex-col gap-0.5 px-5 py-4 ${i === 0 ? 'bottom-14 -left-3 sm:-left-9' : 'top-10 -right-2 sm:-right-6'}`}>
            <span className="text-[30px] leading-tight font-extrabold tracking-tight text-accent">{s.value}</span>
            <span className="text-[13.5px] font-semibold text-muted">{s.label}</span>
          </div>
        ))}
        <div className={`${floatingCard} -bottom-7 right-3 flex items-center gap-3 py-2.5 pr-4 pl-2.5 sm:right-6`}>
          <LogoTile small />
          <span className="flex flex-col leading-snug">
            <span className="text-xs font-semibold text-muted">Founder</span>
            <span className="text-sm font-bold">{profile.company.name}</span>
          </span>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />

      <section aria-label="Experience and certifications" className="border-y border-line bg-soft">
        <div className={`${container} flex flex-wrap items-center gap-x-10 gap-y-4 py-7`}>
          <span className="label">Experience at</span>
          {profile.employers.map((e) => <span key={e} className="text-[17px] font-bold">{e}</span>)}
          <span className="hidden flex-1 lg:block" />
          {profile.certifications.filter((c) => c.status === 'earned').map((c) => (
            <span key={c.name} className="inline-flex items-center gap-2 text-[15px] font-semibold">
              <Icon name="award" size={18} className="text-accent" />
              {c.name.replace('AWS Certified Solutions Architect – Associate', 'AWS Solutions Architect')}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="Results" className={`${container} pt-20 pb-6`}>
        <dl className="m-0 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.achievements.map((a) => (
            <div key={a.label} className="card flex flex-col-reverse gap-1.5 p-7">
              <dt className="text-[15.5px] text-muted">{a.label}</dt>
              <dd className="m-0 text-[44px] leading-none font-extrabold tracking-[-0.03em] text-accent">{a.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="services" className={`${container} py-20 md:py-24`}>
        <div className="mb-12 flex max-w-[660px] flex-col gap-3.5">
          <span className="eyebrow">How I can help</span>
          <h2 className="section-title m-0">Three things I do well, and do every week</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {profile.services.map((s) => (
            <article key={s.title} className="card flex flex-col gap-4.5 p-8">
              <span className="grid size-13 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon name={s.icon} size={26} />
              </span>
              <h3 className="m-0 text-[22px] font-extrabold">{s.title}</h3>
              <p className="m-0 text-base text-muted">{s.text}</p>
              <div className="mt-auto flex flex-wrap gap-2">{s.tags.map((t) => <Tag key={t} name={t} />)}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="border-y border-line bg-soft">
        <div className={`${container} py-20 md:py-24`}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div className="flex max-w-[640px] flex-col gap-3.5">
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title m-0">Results from production, not tutorials</h2>
            </div>
            <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 font-bold text-accent">
              See all {projects.length} projects <Icon name="arrow" size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Link to={`/projects/${lead.id}`} className="card flex min-w-0 flex-col gap-4.5 p-7 text-ink no-underline transition hover:border-accent sm:p-9 lg:row-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className="label">{lead.category} · personal build</span>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12.5px] font-bold text-accent">Live pipeline</span>
              </div>
              <h3 className="m-0 text-[clamp(1.6rem,3vw,1.9rem)] leading-tight font-extrabold">{lead.title}</h3>
              <p className="m-0 text-[16.5px] text-muted">Scanned, signed and canary-released: a bad release reaches 10% of users and rolls itself back.</p>
              <div className="mt-1.5 flex flex-col gap-3.5 rounded-2xl border border-line bg-bg p-5">
                <span className="font-mono text-xs text-muted">run #318 · main · 03:41</span>
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                  {['Gitleaks', 'SonarQube', 'Trivy', 'Cosign', 'Argo CD'].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="tag bg-accent-soft text-accent">✓ {s}</span>
                      <span aria-hidden="true" className="text-muted">→</span>
                    </li>
                  ))}
                  <li><span className="tag bg-accent text-accent-ink">Canary 10%</span></li>
                </ol>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">{lead.tags.slice(0, 5).map((t) => <Tag key={t} name={t} />)}</div>
            </Link>
            {others.map((p) => <ProjectCard key={p.id} project={p} headingLevel="h3" />)}
          </div>
        </div>
      </section>

      <section className={`${container} pt-20 pb-6 md:pt-24`}>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow">Working together</span>
            <h2 className="m-0 text-[clamp(1.9rem,3.6vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">Easy to start, clear from day one</h2>
          </div>
          <ol className="m-0 grid list-none gap-5 p-0 sm:grid-cols-3">
            {profile.steps.map((s, i) => (
              <li key={s.title} className="card flex flex-col gap-2.5 p-6">
                <span className="font-mono text-[13px] font-medium text-accent">0{i + 1}</span>
                <h3 className="m-0 text-[19px] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[15.5px] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="testimonials" className={`${container} py-20 md:py-24`}>
        <div className="mb-10 flex max-w-[640px] flex-col gap-3.5">
          <span className="eyebrow">What colleagues say</span>
          <h2 className="section-title m-0">Calm when production isn’t</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {profile.testimonials.map((t) => (
            <figure key={t.name} className="card m-0 flex flex-col gap-5.5 p-8">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-accent opacity-90">
                <path d="M9.6 6C6 7.6 4 10.4 4 14v4h6v-6H7c0-2.3 1.2-4 3.4-5zM19.6 6C16 7.6 14 10.4 14 14v4h6v-6h-3c0-2.3 1.2-4 3.4-5z" />
              </svg>
              <blockquote className="m-0 text-[17px] leading-[1.65]">{t.quote}</blockquote>
              <figcaption className="mt-auto flex flex-col gap-0.5">
                <span className="font-extrabold">{t.name}</span>
                <span className="text-[14.5px] text-muted">{t.role} · {t.company}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${container} pb-20 md:pb-24`}>
        <div className="flex flex-wrap items-center gap-10 rounded-[28px] bg-brand-navy p-8 text-[#f4f2fb] sm:p-12">
          <LogoTile className="h-32 w-[168px] rounded-[20px]" alt={`${profile.company.name} logo`} />
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2.5">
            <span className="font-mono text-[13px] tracking-[0.08em] text-brand-gold uppercase">Founder · {profile.company.name}</span>
            <h2 className="m-0 text-[34px] leading-tight font-extrabold">{profile.company.slogan}</h2>
            <p className="m-0 max-w-[60ch] text-[17px] text-[#c9c4dd]">
              Consulting and contract engagements run through my company, {profile.company.name}: the same engineering, with a contract and invoice your finance team will recognise.
            </p>
          </div>
          <Link to="/contact" className="btn bg-brand-gold text-brand-navy hover:brightness-105">Ask about consulting</Link>
        </div>
      </section>

      <section id="contact" className="bg-accent">
        <div className={`${container} grid items-start gap-14 py-20 md:py-24 lg:grid-cols-[1fr_1.1fr]`}>
          <div className="flex flex-col gap-5 text-accent-ink">
            <span className="font-mono text-[13px] tracking-[0.08em] uppercase opacity-85">Contact</span>
            <h2 className="m-0 text-[clamp(2.2rem,4.4vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">Have a platform that needs to ship faster, or break less?</h2>
            <p className="m-0 max-w-[46ch] text-lg opacity-90">Send a few lines about the role or project. You’ll hear back within {profile.replyTime}.</p>
            <ul className="m-0 mt-2 flex list-none flex-col gap-3.5 p-0 font-semibold">
              <li><a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 break-all"><Icon name="mail" /> {profile.email}</a></li>
              <li><a href={`mailto:${profile.businessEmail}`} className="inline-flex items-center gap-3 break-all"><Icon name="inbox" /> {profile.businessEmail}</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-3"><Icon name="linkedin" /> {profile.linkedin.replace('https://www.', '')}</a></li>
              <li className="flex items-center gap-3"><Icon name="pin" /> {profile.location.replace(', USA', '')} · {profile.workMode.toLowerCase()}</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-bg p-6 text-ink shadow-[0_30px_60px_-30px_rgb(10_6_30/0.55)] sm:p-9">
            <ContactForm idPrefix="home" />
          </div>
        </div>
      </section>
    </>
  )
}
