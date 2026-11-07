import PageHeader from '../components/PageHeader.jsx'
import profile from '../data/profile.json'

export default function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <PageHeader eyebrow="Contact" title="Let’s talk about your platform">
        The fastest way to reach me is email.
      </PageHeader>
      <ul className="grid max-w-md gap-2 font-mono text-[0.9rem]">
        <li><a href={`mailto:${profile.email}`} className="text-ink">{profile.email}</a></li>
        <li><a href={profile.linkedin} target="_blank" rel="noopener" className="text-ink">LinkedIn</a></li>
        <li><a href={profile.github} target="_blank" rel="noopener" className="text-ink">GitHub</a></li>
      </ul>
    </section>
  )
}
