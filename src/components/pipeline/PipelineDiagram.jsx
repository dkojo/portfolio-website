import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import pipeline from '../../data/pipeline.json'
import { NODE_H, nodeWidth } from './geometry.js'
import { EDGES, byId, edgeById, fmt, liveView, restingState } from './pipelineState.js'
import useGitHubRun from './useGitHubRun.js'
import './pipeline.css'

const { zones, nodes, steps, lastRun } = pipeline
const EDGE_TYPES = [...new Set(EDGES.map((e) => e.type))]
const TRAFFIC = ['users-r53', 'r53-cf', 'cf-alb', 'alb-eks', 'eks-rds']
const SCALE = 11 // simulated seconds shown per real second, so times look like a real pipeline
const MAX_LOG = 200
const GLYPH = { ok: '✓', info: '›', fail: '✕', run: '•' }
const LOG_TONE = { ok: 'text-ok', info: 'text-accent', fail: 'text-fail', run: 'text-muted' }
const STATUS = {
  passed: { label: 'Passed', cls: 'bg-ok/15 text-ok' },
  running: { label: 'Running', cls: 'bg-accent/15 text-accent' },
  failed: { label: 'Failed', cls: 'bg-fail/15 text-fail' },
}
const LEGEND = [
  ['ci', 'Build & scan'], ['cd', 'GitOps delivery'], ['infra', 'Infrastructure'], ['traffic', 'User traffic'],
  ['tel', 'Telemetry'], ['notify', 'Notifications', true], ['fail', 'Failure path', true],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const randomSha = () => Math.random().toString(16).slice(2, 9)
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches


export default function PipelineDiagram({ repo }) {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const live = useGitHubRun(repo)
  const hasLive = live.status === 'live' || live.status === 'stale'
  const [simChosen, setSimChosen] = useState(false)
  const [sim, setSim] = useState(restingState)
  const [selected, setSelected] = useState('eks')
  const [traffic, setTraffic] = useState(!reduced)
  const showLive = hasLive && !simChosen
  const view = useMemo(() => (showLive ? liveView(live) : sim), [showLive, live, sim])

  const pathRefs = useRef({})
  const packetLayer = useRef(null)
  const packets = useRef([])
  const token = useRef(0)
  const runNo = useRef(lastRun.no)
  const tick = useRef(null)
  const logRef = useRef(null)

  // Dots travel along paths outside React state so the page doesn't re-render every frame
  const packet = useCallback(
    (edgeId, type, dur) => {
      const path = pathRefs.current[edgeId]
      if (reduced || !path || !packetLayer.current) return Promise.resolve()
      return new Promise((resolve) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c.setAttribute('r', '4.5')
        c.setAttribute('class', `pk-${type}`)
        packetLayer.current.appendChild(c)
        packets.current.push({ path, len: path.getTotalLength(), c, start: performance.now(), dur, resolve })
      })
    },
    [reduced],
  )

  useEffect(() => {
    let raf
    const frame = (now) => {
      const list = packets.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        const t = Math.min(1, (now - p.start) / p.dur)
        const pt = p.path.getPointAtLength(t * p.len)
        p.c.setAttribute('cx', pt.x)
        p.c.setAttribute('cy', pt.y)
        if (t >= 1) {
          p.c.remove()
          list.splice(i, 1)
          p.resolve()
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      packets.current.forEach((p) => {
        p.c.remove()
        p.resolve()
      })
      packets.current = []
    }
  }, [])

  // Ambient user traffic and telemetry
  useEffect(() => {
    if (!traffic || reduced) return undefined
    const chain = (ids, type, dur) => {
      let i = 0
      const next = () => {
        if (i < ids.length) packet(ids[i++], type, dur).then(next)
      }
      next()
    }
    const users = setInterval(() => {
      if (!document.hidden) chain(TRAFFIC, 'traffic', 620)
    }, 750)
    const telemetry = setInterval(() => {
      if (document.hidden) return
      const viaLoki = Math.random() < 0.5
      chain(['eks-otel', viaLoki ? 'otel-loki' : 'otel-prom', viaLoki ? 'loki-grafana' : 'prom-grafana'], 'tel', 700)
    }, 1100)
    return () => {
      clearInterval(users)
      clearInterval(telemetry)
    }
  }, [traffic, reduced, packet])

  const runPipeline = useCallback(
    async (fail) => {
      const my = ++token.current
      const alive = () => my === token.current
      const no = ++runNo.current
      const sha = randomSha()
      const start = performance.now()
      const elapsed = () => fmt(((performance.now() - start) / 1000) * SCALE)
      const setNode = (id, s) => setSim((v) => ({ ...v, nodeStates: { ...v.nodeStates, [id]: s } }))
      const setEdge = (id, s) => setSim((v) => ({ ...v, edgeStates: { ...v.edgeStates, [id]: s } }))
      const setRun = (patch) => setSim((v) => ({ ...v, run: { ...v.run, ...patch } }))
      const log = (text, lvl) => setSim((v) => ({ ...v, log: [...v.log, { time: elapsed(), text, lvl }].slice(-MAX_LOG) }))
      const travel = async (id) => {
        setEdge(id, 'active')
        await packet(id, edgeById[id].type, 620)
        if (alive()) setEdge(id, 'done')
      }

      setSimChosen(true)
      setSim((v) => ({
        nodeStates: {},
        edgeStates: {},
        log: [...v.log, { head: `run #${no} · commit ${sha} · ${fail ? 'base image not patched' : 'main'}` }].slice(-MAX_LOG),
        run: { no, sha, status: 'running', stage: 'Source', time: '00:00' },
      }))
      log('git push origin feat/checkout-retry', 'run')
      clearInterval(tick.current)
      tick.current = setInterval(() => setRun({ time: elapsed() }), 250)

      try {
        for (const s of steps) {
          if (!alive()) return
          if (s.stage) setRun({ stage: s.stage })
          if (s.edge) {
            await travel(s.edge)
            continue
          }
          setNode(s.node, 'running')
          if (s.logs) {
            for (const line of s.logs) {
              await sleep(s.ms / s.logs.length)
              if (!alive()) return
              log(line, 'ok')
            }
          } else {
            await sleep(s.ms)
          }
          if (!alive()) return

          if (fail && s.failLog) {
            setNode(s.node, 'failed')
            log(s.failLog, 'fail')
            log('Pipeline stopped. The image was not pushed to ECR.', 'fail')
            await travel(`${s.node}-slack`)
            if (!alive()) return
            setNode('slack', 'failed')
            log(`Slack #ci-alerts: run #${no} failed at ${byId[s.node].label}`, 'fail')
            await travel('slack-dev')
            if (!alive()) return
            log('Fix: rebuild on the patched base image and push again.', 'info')
            setRun({ status: 'failed', time: elapsed() })
            return
          }
          setNode(s.node, 'passed')
          if (s.log) log(s.log, 'ok')
        }
        setRun({ status: 'passed', stage: 'Live in prod', time: elapsed() })
      } finally {
        if (alive()) clearInterval(tick.current)
      }
    },
    [packet],
  )

  // Stop any run in flight when the page is left
  useEffect(
    () => () => {
      token.current++
      clearInterval(tick.current)
    },
    [],
  )

  // Play the simulation once on arrival, unless real runs are expected or motion is reduced
  useEffect(() => {
    if (reduced || repo) return undefined
    const t = setTimeout(() => runPipeline(false), 1800)
    return () => clearTimeout(t)
  }, [reduced, repo, runPipeline])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [view.log.length])

  function showLiveRun() {
    token.current++
    clearInterval(tick.current)
    setSimChosen(false)
  }

  const node = byId[selected]
  const status = STATUS[view.run.status]
  const btn = 'cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-semibold'

  return (
    <div className="pipeline">
      <div className="flex flex-wrap items-center gap-x-4.5 gap-y-3 rounded-t-xl border border-b-0 border-line bg-surface px-4 py-3" aria-live="polite">
        <span data-status={view.run.status} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-medium ${status.cls}`}>
          <span className="status-dot" />
          {status.label}
        </span>
        <div className="flex flex-wrap gap-x-4.5 gap-y-1 font-mono text-sm text-muted tabular-nums">
          <span>run <b className="font-medium text-ink">#{view.run.no}</b></span>
          <span>commit <b className="font-medium text-ink">{view.run.sha}</b></span>
          <span>stage <b className="font-medium text-ink">{view.run.stage}</b></span>
          <span>pipeline time <b className="font-medium text-ink">{view.run.time}</b></span>
        </div>
        <div className="flex flex-wrap gap-2 md:ml-auto">
          <button type="button" onClick={() => runPipeline(false)} className={`${btn} border-accent bg-accent text-accent-ink hover:brightness-110`}>
            {hasLive ? 'Run simulation' : 'Run pipeline'}
          </button>
          <button type="button" onClick={() => runPipeline(true)} className={`${btn} border-line text-fail hover:bg-code`}>
            Run with a failing scan
          </button>
          {hasLive && !showLive && (
            <button type="button" onClick={showLiveRun} className={`${btn} border-line text-ink hover:bg-code`}>Show live run</button>
          )}
          {!reduced && (
            <button type="button" aria-pressed={traffic} onClick={() => setTraffic((t) => !t)} className={`${btn} border-line text-ink hover:bg-code`}>
              {traffic ? 'Pause traffic' : 'Start traffic'}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-b-xl border border-line bg-surface">
        <svg
          viewBox="0 0 1440 940"
          className="block h-auto w-full min-w-[1040px]"
          role="img"
          aria-label="Pipeline architecture: GitHub Actions builds, scans and signs the image, pushes it to Amazon ECR, Argo CD deploys it to Amazon EKS with a canary release, users reach it through Route 53, CloudFront and a load balancer, and telemetry flows to Prometheus, Loki and Grafana."
        >
          <defs>
            {EDGE_TYPES.map((t) => (
              <marker key={t} id={`pl-arr-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className={`m-${t}`} />
              </marker>
            ))}
          </defs>

          {zones.map((z) => (
            <g key={z.label}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="14" className={`zone ${z.aws ? 'aws' : ''}`} />
              <text x={z.x + 16} y={z.y + 22} className="zl">{z.label}</text>
            </g>
          ))}

          {EDGES.map((e) => (
            <path
              key={e.id}
              ref={(el) => {
                if (el) pathRefs.current[e.id] = el
              }}
              d={e.d}
              className={`edge e-${e.type} ${e.type} ${view.edgeStates[e.id] || ''}`}
              markerEnd={`url(#pl-arr-${e.type})`}
            />
          ))}

          {nodes.map((n) => {
            const w = nodeWidth(n)
            const x = n.x - w / 2
            const y = n.y - NODE_H / 2
            const tx = n.x - 13
            const ty = y + 8
            return (
              <g
                key={n.id}
                className={`node ${view.nodeStates[n.id] || ''} ${selected === n.id ? 'selected' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`${n.label}: ${n.sub}`}
                aria-pressed={selected === n.id}
                onClick={() => setSelected(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    setSelected(n.id)
                  }
                }}
              >
                <rect x={x - 4} y={y - 4} width={w + 8} height={NODE_H + 8} rx="14" className="halo" />
                <rect x={x} y={y} width={w} height={NODE_H} rx="11" className="box" />
                {n.icon.logo ? (
                  <>
                    <rect x={tx} y={ty} width="26" height="26" rx="6" className="tile" />
                    <image href={`/logos/${n.icon.logo}.svg`} x={tx + 4} y={ty + 4} width="18" height="18" />
                  </>
                ) : (
                  <>
                    <rect x={tx} y={ty} width="26" height="26" rx="6" style={{ fill: n.icon.c }} />
                    <text x={n.x} y={ty + 16.5} textAnchor="middle" className="tile-t">{n.icon.t}</text>
                  </>
                )}
                <text x={n.x} y={n.y + 15} textAnchor="middle" className="n-label">{n.label}</text>
                <text x={n.x} y={n.y + 29} textAnchor="middle" className="n-sub">{n.sub}</text>
                <g className="badge" transform={`translate(${x + w - 10} ${y + 10})`}>
                  <circle r="7" />
                  <path d="M-3 0 L-1 2.5 L3.2 -2.5" className="ck" />
                  <path d="M-2.6 -2.6 L2.6 2.6 M2.6 -2.6 L-2.6 2.6" className="x" />
                </g>
              </g>
            )
          })}

          {EDGES.filter((e) => e.label).map((e) => (
            <text key={e.id} x={e.lp[0]} y={e.lp[1]} textAnchor={e.lp[2]} className="el">{e.label}</text>
          ))}

          <g ref={packetLayer} />
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-5.5 gap-y-2 pt-3 text-sm text-muted">
        {LEGEND.map(([type, label, dashed]) => (
          <span key={type} className="inline-flex items-center gap-2">
            <i className={`inline-block h-0 w-6.5 border-t-[2.5px] ${dashed ? 'border-dashed' : ''}`} style={{ borderColor: `var(--${type === 'fail' ? 'fail' : type})` }} />
            {label}
          </span>
        ))}
        <span className="md:ml-auto">
          {showLive ? (
            <>
              Live from GitHub Actions{live.status === 'stale' ? ' (last update failed, retrying)' : ''} ·{' '}
              <a href={view.run.url} target="_blank" rel="noopener" className="text-accent">open run #{view.run.no}</a>
            </>
          ) : repo && live.status === 'error' ? (
            `Couldn’t reach GitHub (${live.error}), so this is a simulated run.`
          ) : (
            'Simulated run with example output.'
          )}
        </span>
      </div>

      <div className="grid gap-4.5 pt-4.5 md:grid-cols-[1.25fr_1fr]">
        <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-line bg-surface px-4.5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold">Run log</h2>
            <span className="text-sm text-muted">{showLive ? 'GitHub Actions steps' : 'Actions, Argo CD and Grafana events'}</span>
          </div>
          <ol ref={logRef} aria-label="Pipeline log" className="h-75 overflow-y-auto rounded-lg bg-code px-3.5 py-3 font-mono text-[0.8rem] leading-7">
            {view.log.map((l, i) =>
              l.head ? (
                <li key={i} className="mt-2 text-muted first:mt-0">{l.head}</li>
              ) : (
                <li key={i} className="grid grid-cols-[44px_16px_1fr] gap-1.5">
                  <time className="text-muted tabular-nums">{l.time}</time>
                  <span className={`font-semibold ${LOG_TONE[l.lvl]}`}>{GLYPH[l.lvl]}</span>
                  <span className="min-w-0 break-words">{l.text}</span>
                </li>
              ),
            )}
          </ol>
        </div>

        <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-line bg-surface px-4.5 py-4" aria-live="polite">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold">{node.label}</h2>
            <span className="label">{node.zone}</span>
          </div>
          <dl className="grid gap-3">
            {[['What it does', node.role], ['In the 2024 design', node.was], ['Why it changed', node.why]].map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted">Click any box in the diagram to see its details.</p>
        </div>
      </div>
    </div>
  )
}
