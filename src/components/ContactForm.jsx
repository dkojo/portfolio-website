import { useState } from 'react'
import profile from '../data/profile.json'
import Icon from './Icon.jsx'

// Set VITE_FORMSPREE_ID at build time to post the form to Formspree; without it the form opens the visitor's email app
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID
const TOPICS = ['Full-time role', 'Contract', 'Consulting', 'Something else']

const input = 'min-h-12 w-full rounded-xl border-[1.5px] border-line bg-bg px-3.5 py-3 text-[15px] font-medium text-ink placeholder:text-muted/70'
const field = 'flex flex-col gap-2 text-sm font-semibold'

// idPrefix keeps ids unique when the form appears on the home page and the contact page
export default function ContactForm({ idPrefix = 'c', heading, className = '' }) {
  const [topic, setTopic] = useState(TOPICS[0])
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState('')

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (!data.get('name')?.trim() || !data.get('email')?.trim() || !data.get('message')?.trim()) {
      setState('error')
      setMessage('Fill in your name, email and message to send.')
      return
    }
    data.set('type', topic)
    const subject = `${topic}: message from ${data.get('name')}`

    if (!FORMSPREE_ID) {
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} · ${data.get('email')}`)
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${body}`
      setState('error')
      setMessage('Your email app should open with the message filled in. Press send there to deliver it.')
      return
    }

    // Formspree uses _subject for the email subject, and replies go to the "email" field
    data.set('_subject', subject)
    setState('sending')
    setMessage('')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(res.statusText)
      form.reset()
      setState('sent')
    } catch {
      setState('error')
      setMessage(`The message didn’t send. Please email me directly at ${profile.email}.`)
    }
  }

  if (state === 'sent') {
    return (
      <div className={`flex flex-col items-start gap-4 py-10 ${className}`} role="status">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent">
          <Icon name="check" size={30} strokeWidth={2.6} />
        </span>
        <h3 className="m-0 text-[28px] font-extrabold">Message sent</h3>
        <p className="m-0 text-[17px] text-muted">Thanks for reaching out. You’ll hear from me within {profile.replyTime}.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setState('idle')}>Send another message</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={`flex flex-col gap-5 ${className}`}>
      {heading && <h2 className="m-0 text-[26px] font-extrabold">{heading}</h2>}
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2.5 text-sm font-semibold">What’s this about?</legend>
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className="min-h-11 cursor-pointer rounded-full border-[1.5px] border-line bg-bg px-4 text-[14.5px] font-semibold text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:font-bold aria-pressed:text-accent-ink"
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor={`${idPrefix}-name`} className={field}>
          Name
          <input id={`${idPrefix}-name`} name="name" autoComplete="name" required placeholder="Jane Smith" className={input} />
        </label>
        <label htmlFor={`${idPrefix}-email`} className={field}>
          Work email
          <input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" required placeholder="jane@company.com" className={input} />
        </label>
      </div>
      <label htmlFor={`${idPrefix}-company`} className={field}>
        <span>Company <span className="font-medium text-muted">(optional)</span></span>
        <input id={`${idPrefix}-company`} name="company" autoComplete="organization" placeholder="Where you work" className={input} />
      </label>
      <label htmlFor={`${idPrefix}-msg`} className={field}>
        Message
        <textarea id={`${idPrefix}-msg`} name="message" required rows={5} placeholder="The role, the team, or the platform you’re working on" className={`${input} min-h-[140px] resize-y`} />
      </label>
      {/* Spam trap: hidden from people and screen readers; Formspree drops submissions where bots fill it in */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={state === 'sending'} className="btn btn-primary btn-lg disabled:opacity-70">
        {state === 'sending' ? 'Sending…' : 'Send message'}
        <Icon name="arrow" size={18} strokeWidth={2.4} />
      </button>
      {state === 'error' && <p role="status" className="m-0 text-sm font-semibold text-warn">{message}</p>}
      <p className="m-0 text-[13.5px] text-muted">No spam, no mailing list. Protected against bots. Your message goes straight to my inbox.</p>
    </form>
  )
}
