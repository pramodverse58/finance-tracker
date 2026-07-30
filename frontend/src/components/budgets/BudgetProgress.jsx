import { formatCurrency } from '../../utils/format'

export default function BudgetProgress({ budget, onDelete }) {
  const pct = Math.min(budget.percentUsed, 100)
  const barColor = budget.overBudget ? 'bg-loss-500' : pct > 80 ? 'bg-gold-500' : 'bg-gain-500'

  return (
    <div className={`card p-4 ${budget.overBudget ? 'border-loss-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-paper text-sm font-medium">{budget.category}</p>
        <button onClick={() => onDelete(budget.id)} className="text-xs text-muted hover:text-loss-400 transition-colors">
          Remove
        </button>
      </div>

      <div className="w-full h-2 bg-ink-800 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="figure text-muted">
          {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.limitAmount)}
        </span>
        {budget.overBudget ? (
          <span className="text-loss-400 font-medium">⚠ Over by {formatCurrency(Math.abs(budget.remainingAmount))}</span>
        ) : (
          <span className="text-muted">{budget.percentUsed.toFixed(0)}% used</span>
        )}
      </div>
    </div>
  )
}
