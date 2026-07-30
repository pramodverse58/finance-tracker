export default function StatCard({ label, value, tone = 'neutral' }) {
  const toneClass = {
    neutral: 'text-paper',
    gain: 'text-gain-400',
    loss: 'text-loss-400',
    gold: 'text-gold-400',
  }[tone]

  return (
    <div className="card p-5 border-l-2 border-l-gold-500/60">
      <p className="text-xs uppercase tracking-wide text-muted mb-2">{label}</p>
      <p className={`figure text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  )
}
