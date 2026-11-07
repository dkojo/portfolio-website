import { eyebrow as eyebrowClass } from '../lib/ui.js'

export default function PageHeader({ eyebrow, title, children, as: Heading = 'h1' }) {
  return (
    <div className="mb-9 flex max-w-[65ch] flex-col gap-2">
      {eyebrow && <div className={eyebrowClass}>{eyebrow}</div>}
      <Heading className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold leading-tight">{title}</Heading>
      {children && <p className="text-muted">{children}</p>}
    </div>
  )
}
