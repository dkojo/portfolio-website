import pipeline from '../../data/pipeline.json'
import { eyebrow } from '../../lib/ui.js'

export default function ChangesTable() {
  return (
    <div className="mt-14 grid gap-4">
      <div className={eyebrow}>2024 → 2026</div>
      <h2 className="text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold">What changed from the original design</h2>
      <p className="max-w-[70ch] text-muted">
        The 2024 version worked end to end. These upgrades remove manual steps and stored credentials, and add the checks a production team expects.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[820px] border-collapse text-[0.9rem]">
          <thead>
            <tr>
              {['Area', '2024', '2026', 'Why'].map((h) => (
                <th key={h} className="border-b border-line px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wide text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipeline.changes.map(([area, before, after, why]) => (
              <tr key={area} className="align-top [&:last-child>td]:border-b-0">
                <td className="border-b border-line px-4 py-2.5 font-semibold whitespace-nowrap">{area}</td>
                <td className="border-b border-line px-4 py-2.5 text-muted">{before}</td>
                <td className="border-b border-line px-4 py-2.5">{after}</td>
                <td className="border-b border-line px-4 py-2.5">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
