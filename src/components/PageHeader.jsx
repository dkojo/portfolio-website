export default function PageHeader({ eyebrow, title, children, as: Heading = 'h1' }) {
  const size = Heading === 'h1' ? 'text-[clamp(2.25rem,5vw,3.4rem)] leading-[1.06] tracking-[-0.035em]' : 'section-title'
  return (
    <div className="mb-10 flex max-w-[680px] flex-col gap-3.5">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading className={`m-0 font-extrabold ${size}`}>{title}</Heading>
      {children && <p className="m-0 text-lg text-muted">{children}</p>}
    </div>
  )
}
