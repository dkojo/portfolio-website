import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <PageHeader eyebrow="404" title="This page doesn’t exist">
        The link may be old or mistyped.
      </PageHeader>
      <Link to="/" className="rounded-lg bg-accent px-4.5 py-2.5 font-semibold text-accent-ink no-underline">
        Go to the home page
      </Link>
    </section>
  )
}
