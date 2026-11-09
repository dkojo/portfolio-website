import Icon from './Icon.jsx'

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const current = root.dataset.theme || (prefersDark() ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      title="Switch colour theme"
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border-[1.5px] border-line text-ink hover:bg-soft"
    >
      <Icon name="moon" size={18} />
    </button>
  )
}
