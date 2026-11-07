import { Link, useParams } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import projects from '../data/projects.json'
import NotFound from './NotFound.jsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)
  if (!project) return <NotFound />

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Link to="/projects" className="mb-6 inline-block text-sm text-accent">← All projects</Link>
      <PageHeader eyebrow={project.category} title={project.title}>
        {project.summary}
      </PageHeader>
    </section>
  )
}
