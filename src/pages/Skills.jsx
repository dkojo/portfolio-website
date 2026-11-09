import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tag from '../components/Tag.jsx'
import skills from '../data/skills.json'
import { container } from '../lib/ui.js'

export default function Skills() {
  return (
    <>
      <section className={`${container} pt-14 pb-20 md:pt-20`}>
        <PageHeader eyebrow="Skills" title="What I work with">
          Tools grouped by area, from cloud platforms and pipelines to security and observability.
        </PageHeader>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group} className="card flex min-w-0 flex-col gap-3.5 p-6">
              <h2 className="m-0 text-[17px] font-extrabold">{g.group}</h2>
              <div className="flex flex-wrap gap-1.5">{g.items.map((t) => <Tag key={t} name={t} />)}</div>
            </div>
          ))}
        </div>
      </section>
      <section className={`${container} pb-24`}>
        <CtaBand title="Need these skills on your team?" text="Tell me about the role or project. I reply within one business day." />
      </section>
    </>
  )
}
