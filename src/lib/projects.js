import experience from '../data/experience.json'

const yearOf = (date) => (date === 'Present' ? 'now' : date.slice(-4))

// "Data Service Group · 2024 – now", or the project's own context for personal work
export function contextFor(project) {
  if (project.context) return project.context
  const job = experience.find((j) => j.id === project.org)
  return job ? `${job.short} · ${yearOf(job.start)} – ${yearOf(job.end)}` : ''
}
