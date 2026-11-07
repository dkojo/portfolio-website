export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-9 flex max-w-[65ch] flex-col gap-2">
      {eyebrow && <div className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{eyebrow}</div>}
      <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-tight">{title}</h1>
      {children && <p className="text-muted">{children}</p>}
    </div>
  )
}
