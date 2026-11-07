import { useEffect, useState } from 'react'

const IDLE_MS = 120_000
const ACTIVE_MS = 20_000

// Latest GitHub Actions run for a public repo, with its job steps. Unauthenticated requests are limited
// to 60 an hour per visitor, so poll slowly, skip the jobs call when nothing changed, and pause in hidden tabs.
export default function useGitHubRun(repo) {
  const [state, setState] = useState({ status: repo ? 'loading' : 'off' })

  useEffect(() => {
    if (!repo) return undefined
    let cancelled = false
    let timer
    let lastKey = ''
    let active = false

    const api = async (path) => {
      const res = await fetch(`https://api.github.com/repos/${repo}${path}`, { headers: { Accept: 'application/vnd.github+json' } })
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`)
      return res.json()
    }

    async function poll() {
      if (!document.hidden) {
        try {
          const { workflow_runs: runs = [] } = await api('/actions/runs?per_page=1')
          const run = runs[0]
          active = run?.status === 'in_progress' || run?.status === 'queued'
          if (!run) {
            if (!cancelled) setState({ status: 'empty' })
          } else if (`${run.id}:${run.updated_at}` !== lastKey) {
            lastKey = `${run.id}:${run.updated_at}`
            const { jobs = [] } = await api(`/actions/runs/${run.id}/jobs`)
            if (!cancelled) setState({ status: 'live', run, steps: jobs.flatMap((j) => j.steps || []), checkedAt: Date.now() })
          } else if (!cancelled) {
            setState((s) => ({ ...s, checkedAt: Date.now() }))
          }
        } catch (err) {
          if (!cancelled) setState((s) => ({ ...s, status: s.run ? 'stale' : 'error', error: err.message }))
        }
      }
      if (!cancelled) timer = setTimeout(poll, active ? ACTIVE_MS : IDLE_MS)
    }

    poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [repo])

  return state
}
