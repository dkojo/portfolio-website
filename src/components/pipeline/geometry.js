export const NODE_H = 72
export const nodeWidth = (n) => n.w || 124

function anchor(n, side) {
  const w = nodeWidth(n)
  return { r: [n.x + w / 2, n.y], l: [n.x - w / 2, n.y], t: [n.x, n.y - NODE_H / 2], b: [n.x, n.y + NODE_H / 2] }[side]
}

// Smooth S-curve from the facing sides of two nodes; edges with a hand-drawn "d" in pipeline.json skip this
export function route(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    const [x1, y1] = anchor(a, dx > 0 ? 'r' : 'l')
    const [x2, y2] = anchor(b, dx > 0 ? 'l' : 'r')
    const mx = (x1 + x2) / 2
    return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
  }
  const [x1, y1] = anchor(a, dy > 0 ? 'b' : 't')
  const [x2, y2] = anchor(b, dy > 0 ? 't' : 'b')
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`
}
