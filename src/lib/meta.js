import profile from '../data/profile.json'
import projects from '../data/projects.json'

const site = profile.name

const PAGES = {
  '/': {
    title: `${site} · DevOps & Cloud Engineer`,
    description: `${profile.title} in ${profile.location}. ${profile.tagline}`,
  },
  '/about': {
    title: `About · ${site}`,
    description: 'From Linux systems administration in Ghana to CI/CD, Kubernetes and Terraform-built AWS platforms in London and the US.',
  },
  '/skills': {
    title: `Skills · ${site}`,
    description: 'AWS, Kubernetes, OpenShift, Terraform, Ansible, Jenkins, GitHub Actions, ArgoCD, DevSecOps scanning and observability tools.',
  },
  '/projects': {
    title: `Projects · ${site}`,
    description: `${projects.length} DevOps case studies: CI/CD, DevSecOps, Kubernetes, AWS cost optimisation, observability and Linux automation.`,
  },
  '/resume': {
    title: `Resume · ${site}`,
    description: `Resume of ${site}, ${profile.title}. Experience, certifications, education and a downloadable PDF.`,
  },
  '/contact': {
    title: `Contact · ${site}`,
    description: `Contact ${site} for full-time, contract or remote DevOps and cloud engineering work.`,
  },
}

export const NOT_FOUND = { title: `Page not found · ${site}`, description: 'This page doesn’t exist.' }

// Every URL the build pre-renders and lists in the sitemap
export const ROUTES = [...Object.keys(PAGES), ...projects.map((p) => `/projects/${p.id}`)]

export function metaFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (PAGES[path]) return PAGES[path]
  const project = path.startsWith('/projects/') && projects.find((p) => `/projects/${p.id}` === path)
  if (project) return { title: `${project.title} · ${site}`, description: project.summary }
  return NOT_FOUND
}
