import { useEffect, useState } from 'react'
import * as budgetApi from '../api/budgetApi'
import BudgetForm from '../components/budgets/BudgetForm'
import BudgetProgress from '../components/budgets/BudgetProgress'
import MonthPicker from '../components/common/MonthPicker'
import { currentMonth } from '../utils/format'

export default function Budgets() {
  const [month, setMonth] = useState(currentMonth())
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBudgets = (m) => {
    setLoading(true)
    budgetApi.getBudgets(m)
      .then(setBudgets)
      .catch(() => setError('Could not load budgets.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBudgets(month) }, [month])

  const handleCreate = async (payload) => {
    const created = await budgetApi.createBudget(payload)
    setBudgets((list) => [...list, created])
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this budget?')) return
    await budgetApi.deleteBudget(id)
    setBudgets((list) => list.filter((b) => b.id !== id))
  }

  const overBudgetCount = budgets.filter((b) => b.overBudget).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-paper">Budgets</h1>
          <p className="text-muted text-sm mt-1">Set limits, watch for overspending</p>
        </div>
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      {overBudgetCount > 0 && (
        <div className="border border-loss-500/40 bg-loss-500/10 rounded-md px-4 py-3 text-sm text-loss-400">
          ⚠ {overBudgetCount} {overBudgetCount === 1 ? 'category is' : 'categories are'} over budget.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BudgetForm month={month} onSubmit={handleCreate} />
        </div>
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <p className="text-muted text-sm">Loading…</p>
          ) : budgets.length === 0 ? (
            <div className="card p-8 text-center text-muted text-sm">
              No budgets set for this month yet.
            </div>
          ) : (
            budgets.map((b) => <BudgetProgress key={b.id} budget={b} onDelete={handleDelete} />)
          )}
        </div>
      </div>
    </div>
  )
}
