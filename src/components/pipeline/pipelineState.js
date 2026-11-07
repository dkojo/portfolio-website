import pipeline from '../../data/pipeline.json'
import { route } from './geometry.js'

const { nodes, edges, steps, lastRun } = pipeline
export const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
export const EDGES = edges.map((e) => ({ ...e, id: `${e.from}-${e.to}`, d: e.d || route(byId[e.from], byId[e.to]) }))
export const edgeById = Object.fromEntries(EDGES.map((e) => [e.id, e]))
const RUN_NODES = [...new Set(steps.filter((s) => s.node).map((s) => s.node))]

export const fmt = (s) => {
  const t = Math.max(0, s)
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`
}
// The last successful run, shown before anything animates so the page is complete at rest
export function restingState() {
  return {
    nodeStates: Object.fromEntries(RUN_NODES.map((id) => [id, 'passed'])),
    edgeStates: Object.fromEntries(EDGES.filter((e) => e.type !== 'fail').map((e) => [e.id, 'done'])),
    log: [{ head: lastRun.head }, ...lastRun.lines.map(([time, text, lvl]) => ({ time, text, lvl }))],
    run: { no: lastRun.no, sha: lastRun.sha, status: 'passed', stage: 'Live in prod', time: lastRun.time },
  }
}

// Map a real GitHub Actions run onto the diagram: each node's "match" text is looked up in the step names
export function liveView({ run, steps: ghSteps }) {
  const stateOf = (step) => {
    if (step.status === 'in_progress') return 'running'
    if (step.status !== 'completed') return undefined
    if (step.conclusion === 'success') return 'passed'
    if (step.conclusion === 'failure') return 'failed'
    return undefined
  }
  const nodeStates = {}
  for (const n of nodes) {
    // Match from the start of a word: "sonar" finds "SonarQube", but "ecr" doesn't match inside "secret"
    const word = n.match && new RegExp(`\\b${n.match}`, 'i')
    const step = word && ghSteps.find((s) => word.test(s.name))
    if (step) nodeStates[n.id] = stateOf(step)
  }
  if (Object.values(nodeStates).some(Boolean)) nodeStates.dev = 'passed'

  const edgeStates = {}
  for (const e of EDGES) {
    if (e.type !== 'ci' && e.type !== 'cd') continue
    const to = nodeStates[e.to]
    if (nodeStates[e.from] === 'passed' && to) edgeStates[e.id] = to === 'running' ? 'active' : 'done'
  }

  const t0 = new Date(run.run_started_at || run.created_at).getTime()
  const end = run.status === 'completed' ? new Date(run.updated_at).getTime() : Date.now()
  const status = run.status !== 'completed' ? 'running' : run.conclusion === 'success' ? 'passed' : 'failed'
  const current = ghSteps.find((s) => s.status === 'in_progress')
  const lvl = (s) => (s.conclusion === 'success' ? 'ok' : s.conclusion === 'failure' ? 'fail' : s.status === 'in_progress' ? 'info' : 'run')

  return {
    nodeStates,
    edgeStates,
    log: [
      { head: `run #${run.run_number} · commit ${run.head_sha.slice(0, 7)} · ${run.head_branch}` },
      ...ghSteps.filter((s) => s.started_at).map((s) => ({ time: fmt((new Date(s.started_at) - t0) / 1000), text: s.name, lvl: lvl(s) })),
    ],
    run: {
      no: run.run_number,
      sha: run.head_sha.slice(0, 7),
      status,
      stage: current?.name || { passed: 'Complete', failed: 'Failed', running: 'Queued' }[status],
      time: fmt((end - t0) / 1000),
      url: run.html_url,
    },
  }
}
