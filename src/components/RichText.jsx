// Renders **highlighted** segments from the JSON content files
export default function RichText({ text, strongClassName = 'font-semibold text-ink' }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? <strong key={i} className={strongClassName}>{part}</strong> : part,
  )
}
