import { logoFor } from '../lib/logos.js'

// Logos sit on a white tile so dark marks (GitHub, Bash) stay visible in dark mode
export default function Tag({ name, large = false }) {
  const logo = logoFor(name)
  const shape = large
    ? 'gap-2 rounded-lg border border-line bg-surface py-1.5 pr-3 pl-1.5 text-[0.86rem]'
    : `gap-1.5 rounded bg-code py-0.5 pr-2 text-xs ${logo ? 'pl-0.5' : 'pl-2'}`

  return (
    <span className={`inline-flex items-center font-mono text-ink ${shape}`}>
      {logo && (
        <span className={`grid shrink-0 place-items-center rounded bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)] ${large ? 'size-7 p-1' : 'size-5 p-0.75'}`}>
          <img src={logo} alt="" width={large ? 20 : 14} height={large ? 20 : 14} loading="lazy" className="size-full object-contain" />
        </span>
      )}
      {name}
    </span>
  )
}
