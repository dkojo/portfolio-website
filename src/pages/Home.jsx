import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Tag from '../components/Tag.jsx'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import { btnGhost, btnPrimary, card, eyebrow } from '../lib/ui.js'

const featured = projects.filter((p) => p.featured)

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-14">
        <div className="grid items-center gap-12 md:grid-cols-[1.35fr_1fr]">
          <div>
            <div className={eyebrow}>{profile.title} · {profile.location.replace(', USA', '')}</div>
            <h1 className="mt-3.5 mb-4.5 text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold leading-[1.05] tracking-tight [font-stretch:118%]">
              {profile.name}
            </h1>
            <p className="max-w-[54ch] text-lg text-muted">{profile.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/projects" className={btnPrimary}>View projects</Link>
              <a href={profile.resume} download className={btnGhost}>Download resume</a>
              <Link to="/contact" className={btnGhost}>Contact me</Link>
            </div>
          </div>

          <div className={`${card} w-full max-w-[440px] overflow-hidden shadow-[0_12px_32px_-18px_rgb(0_0_0/0.25)] md:justify-self-end`}>
            <div className="relative">
              {/* WebP at the two sizes the card is shown at; the JPEG stays as the fallback */}
              <picture>
                <source type="image/webp" srcSet="/daniel-megbenu-440.webp 440w, /daniel-megbenu-720.webp 720w" sizes="(min-width: 768px) 440px, calc(100vw - 32px)" />
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  width="720"
                  height="900"
                  fetchPriority="high"
                  className="aspect-[4/3.4] w-full object-cover object-[50%_22%]"
                />
              </picture>
            </div>
            <dl className="grid grid-cols-2 border-t border-line">
              {profile.stats.map((s, i) => (
                <div key={s.label} className={`flex flex-col-reverse px-4.5 py-4 ${i < 2 ? 'border-b border-line' : ''} ${i % 2 === 0 ? 'border-r border-line' : ''}`}>
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold leading-tight tabular-nums [font-stretch:110%]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 grid gap-3.5 border-t border-dashed border-line pt-5.5" aria-label="Core technologies">
          <span className={eyebrow}>Core stack</span>
          <div className="flex flex-wrap gap-2.5">
            {profile.stack.map((t) => <Tag key={t} name={t} large />)}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <PageHeader eyebrow="Featured work" title="Three results to start with" as="h2">
            Production work with measured outcomes. Open a card for the full case study.
          </PageHeader>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProjectCard key={p.id} project={p} headingLevel="h3" />)}
          </div>
          <Link to="/projects" className="mt-8 inline-block font-semibold text-accent">See all {projects.length} projects →</Link>
        </div>
      </section>
    </>
  )
}
