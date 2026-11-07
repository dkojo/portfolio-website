import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import profile from '../data/profile.json'
import { btnPrimary, card, sectionWrap } from '../lib/ui.js'

// Set VITE_FORMSPREE_ID at build time to post the form to Formspree; without it the form opens the visitor's email app
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

const icons = {
  email: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-7 0C6.3.7 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.6 6.4 7A3.4 3.4 0 0 0 9 18.1V22" />,
  location: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
}

function Channel({ icon, label, children, action }) {
  return (
    <div className={`${card} flex min-w-0 items-center gap-3.5 px-4 py-3.5`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-accent">
        {icons[icon]}
      </svg>
      <div className="min-w-0 flex-1">
        <small className="block font-mono text-xs uppercase tracking-wide text-muted">{label}</small>
        <div className="font-mono text-[0.9rem] break-words">{children}</div>
      </div>
      {action}
    </div>
  )
}

const inputClass = 'w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[0.95rem] text-ink'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState(null) // { tone: 'ok' | 'warn', text }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setStatus({ tone: 'warn', text: `Copy isn’t available in this browser. The address is ${profile.email}.` })
    }
  }

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (!data.get('name')?.trim() || !data.get('email')?.trim() || !data.get('message')?.trim()) {
      setStatus({ tone: 'warn', text: 'Fill in your name, email and message to send.' })
      return
    }

    const subject = `${data.get('type')}: message from ${data.get('name')}`

    if (!FORMSPREE_ID) {
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} · ${data.get('email')}`)
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${body}`
      setStatus({ tone: 'ok', text: 'Your email app should open with the message filled in. Press send there to deliver it.' })
      return
    }

    // Formspree uses _subject for the email subject and replies go to the "email" field
    data.set('_subject', subject)
    setStatus({ tone: 'ok', text: 'Sending…' })
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(res.statusText)
      form.reset()
      setStatus({ tone: 'ok', text: 'Message sent. I reply within one working day.' })
    } catch {
      setStatus({ tone: 'warn', text: `The message didn’t send. Please email me directly at ${profile.email}.` })
    }
  }

  return (
    <section className={sectionWrap}>
      <PageHeader eyebrow="Contact" title="Let’s talk about your platform">
        The fastest way to reach me is email. I reply within one working day.
      </PageHeader>

      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="grid gap-3">
            <Channel
              icon="email"
              label="Email"
              action={
                <button type="button" onClick={copyEmail} className="shrink-0 cursor-pointer rounded-md border border-line px-2.5 py-1 text-sm font-medium hover:bg-code">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              }
            >
              <a href={`mailto:${profile.email}`} className="text-ink no-underline hover:text-accent">{profile.email}</a>
            </Channel>
            <Channel icon="phone" label="Phone">
              <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="text-ink no-underline hover:text-accent">{profile.phone}</a>
            </Channel>
            <Channel icon="linkedin" label="LinkedIn">
              <a href={profile.linkedin} target="_blank" rel="noopener" className="text-ink no-underline hover:text-accent">
                {profile.linkedin.replace('https://www.', '')}
              </a>
            </Channel>
            <Channel icon="github" label="GitHub">
              <a href={profile.github} target="_blank" rel="noopener" className="text-ink no-underline hover:text-accent">
                {profile.github.replace('https://', '')}
              </a>
            </Channel>
            <Channel icon="location" label="Location">{profile.location} · {profile.workMode}</Channel>
          </div>
          <ul className="mt-4.5 flex flex-wrap gap-2" aria-label="Availability">
            {profile.availability.map((a) => (
              <li key={a} className="inline-flex items-center gap-1.75 rounded-full bg-ok/15 px-2.5 py-0.5 font-mono text-xs text-ok">
                <span className="size-1.75 rounded-full bg-current" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} noValidate className={`${card} grid gap-3.5 p-6`}>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <label htmlFor="f-name" className="grid gap-1.5 text-sm font-medium">
              Name
              <input id="f-name" name="name" autoComplete="name" required className={inputClass} />
            </label>
            <label htmlFor="f-email" className="grid gap-1.5 text-sm font-medium">
              Email
              <input id="f-email" name="email" type="email" autoComplete="email" required className={inputClass} />
            </label>
          </div>
          <label htmlFor="f-type" className="grid gap-1.5 text-sm font-medium">
            What is this about?
            <select id="f-type" name="type" className={inputClass}>
              <option>Full-time role</option>
              <option>Contract work</option>
              <option>Freelance project</option>
              <option>Something else</option>
            </select>
          </label>
          <label htmlFor="f-msg" className="grid gap-1.5 text-sm font-medium">
            Message
            <textarea id="f-msg" name="message" required rows="5" placeholder="A few lines about the role or project" className={`${inputClass} resize-y`} />
          </label>
          {/* Spam trap: hidden from people and screen readers; Formspree drops submissions where bots fill it in */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div><button type="submit" className={btnPrimary}>Send message</button></div>
          {status && <p role="status" className={`text-sm ${status.tone === 'ok' ? 'text-ok' : 'text-warn'}`}>{status.text}</p>}
        </form>
      </div>
    </section>
  )
}
