import { useState } from 'react'
import ContactForm from '../components/ContactForm.jsx'
import Icon from '../components/Icon.jsx'
import LogoTile from '../components/LogoTile.jsx'
import profile from '../data/profile.json'
import { container } from '../lib/ui.js'

// Lets long addresses wrap before "@" or "/" instead of mid-word on narrow screens
const breakable = (text) => text.split(/(?=[@/])/).flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]))

function Channel({ icon, label, children, action }) {
  return (
    <li className="card flex min-w-0 items-center gap-3.5 px-5 py-4">
      <Icon name={icon} size={22} className="text-accent" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="label">{label}</span>
        <span className="font-bold [overflow-wrap:anywhere]">{children}</span>
      </span>
      {action}
    </li>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(null)

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      // Clipboard can be blocked; the address stays visible to select by hand
    }
  }

  const copyButton = (text) => (
    <button type="button" onClick={() => copy(text)} className="min-h-11 shrink-0 cursor-pointer rounded-lg border-[1.5px] border-line bg-transparent px-3 text-sm font-semibold text-ink hover:bg-soft">
      {copied === text ? 'Copied' : 'Copy'}
    </button>
  )

  return (
    <div className="bg-soft">
      <section className={`${container} grid items-start gap-14 pt-14 pb-24 md:pt-18 lg:grid-cols-[1fr_1.15fr]`}>
        <div className="flex min-w-0 flex-col gap-7">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Contact</span>
            <h1 className="m-0 text-[clamp(2.2rem,5vw,3.25rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">Let’s talk about your platform</h1>
            <p className="m-0 max-w-[46ch] text-lg text-muted">Hiring for a cloud or DevOps role, or need help with a pipeline, cluster or AWS bill? Send a few lines. That’s all it takes to start.</p>
          </div>

          <div className="card flex flex-col gap-4.5 p-7">
            <h2 className="m-0 text-lg font-extrabold">What happens next</h2>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {[
                ['I reply within one business day', 'Usually the same day, from my own inbox.'],
                ['A 20-minute call', 'Your platform, your goals, and whether I’m the right fit.'],
                ['A clear next step', 'An interview, a contract, or a scoped consulting plan.'],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-extrabold text-accent">{i + 1}</span>
                  <span><b>{title}</b><br /><span className="text-muted">{text}</span></span>
                </li>
              ))}
            </ol>
          </div>

          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <Channel icon="mail" label="Email" action={copyButton(profile.email)}>
              <a href={`mailto:${profile.email}`} className="hover:text-accent">{breakable(profile.email)}</a>
            </Channel>
            <Channel icon="inbox" label="Business enquiries" action={copyButton(profile.businessEmail)}>
              <a href={`mailto:${profile.businessEmail}`} className="hover:text-accent">{breakable(profile.businessEmail)}</a>
            </Channel>
            <Channel icon="linkedin" label="LinkedIn">
              <a href={profile.linkedin} target="_blank" rel="noopener" className="hover:text-accent">{breakable(profile.linkedin.replace('https://www.', ''))}</a>
            </Channel>
            <Channel icon="pin" label="Location and work style">{profile.location.replace(', USA', '')} · {profile.workMode.toLowerCase()}</Channel>
          </ul>

          <div className="flex items-center gap-3.5 rounded-2xl bg-brand-navy px-5 py-4 text-[#f4f2fb]">
            <LogoTile small className="size-13 rounded-xl" />
            <span className="text-[15px] text-[#c9c4dd]">Consulting and contract work runs through <b className="text-[#f4f2fb]">{profile.company.name}</b>. Choose “Consulting” in the form.</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-line bg-bg p-6 shadow-[0_30px_60px_-36px_rgb(23_17_42/0.35)] sm:p-10">
          <ContactForm idPrefix="c" heading="Send a message" />
        </div>
      </section>
    </div>
  )
}
