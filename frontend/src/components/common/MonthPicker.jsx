export default function MonthPicker({ month, onChange }) {
  return (
    <input
      type="month"
      value={month}
      onChange={(e) => onChange(e.target.value)}
      className="bg-ink-800 border border-ink-600 rounded-md px-3 py-1.5 text-sm text-paper font-mono focus:border-gold-500 outline-none"
    />
  )
}
