import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import { btnPrimary } from '../lib/ui.js'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <PageHeader eyebrow="404" title="This page doesn’t exist">
        The link may be old or mistyped.
      </PageHeader>
      <Link to="/" className={btnPrimary}>Go to the home page</Link>
    </section>
  )
}
