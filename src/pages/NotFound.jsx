import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import { container } from '../lib/ui.js'

export default function NotFound() {
  return (
    <section className={`${container} py-24`}>
      <PageHeader eyebrow="404" title="This page doesn’t exist">
        The link may be old or mistyped.
      </PageHeader>
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn btn-primary">Go to the home page</Link>
        <Link to="/contact" className="btn btn-ghost">Contact me</Link>
      </div>
    </section>
  )
}
