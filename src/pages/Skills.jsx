import PageHeader from '../components/PageHeader.jsx'
import Tag from '../components/Tag.jsx'
import skills from '../data/skills.json'
import { card, sectionWrap } from '../lib/ui.js'

export default function Skills() {
  return (
    <section className={sectionWrap}>
      <PageHeader eyebrow="Skills" title="What I work with">
        Tools grouped by area, from cloud platforms and pipelines to security and observability.
      </PageHeader>
      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((g) => (
          <div key={g.group} className={`${card} flex min-w-0 flex-col gap-3 p-4.5`}>
            <h2 className="text-base font-bold">{g.group}</h2>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((t) => <Tag key={t} name={t} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
