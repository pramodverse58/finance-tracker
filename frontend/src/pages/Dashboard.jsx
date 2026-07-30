import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../api/dashboardApi'
import { getBudgets } from '../api/budgetApi'
import StatCard from '../components/dashboard/StatCard'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import TrendChart from '../components/dashboard/TrendChart'
import MonthPicker from '../components/common/MonthPicker'
import { currentMonth, formatCurrency } from '../utils/format'

export default function Dashboard() {
  const [month, setMonth] = useState(currentMonth())
  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([getDashboardSummary(month), getBudgets(month)])
      .then(([summaryData, budgetData]) => {
        if (!cancelled) {
          setSummary(summaryData)
          setBudgets(budgetData)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load dashboard data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [month])

  const overBudgetCount = budgets.filter((b) => b.overBudget).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-paper">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Your finances at a glance</p>
        </div>
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total income" value={formatCurrency(summary.totalIncome)} tone="gain" />
            <StatCard label="Total expense" value={formatCurrency(summary.totalExpense)} tone="loss" />
            <StatCard
              label="Net balance"
              value={formatCurrency(summary.netBalance)}
              tone={Number(summary.netBalance) >= 0 ? 'gain' : 'loss'}
            />
          </div>

          {overBudgetCount > 0 && (
            <div className="border border-loss-500/40 bg-loss-500/10 rounded-md px-4 py-3 text-sm text-loss-400">
              ⚠ {overBudgetCount} {overBudgetCount === 1 ? 'category is' : 'categories are'} over budget this month.
              {' '}
              <a href="/budgets" className="underline hover:text-loss-300">Review budgets →</a>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h2 className="font-display text-lg text-paper mb-4">Spending by category</h2>
              <CategoryPieChart data={summary.expenseByCategory} />
            </div>
            <div className="card p-5">
              <h2 className="font-display text-lg text-paper mb-4">6-month trend</h2>
              <TrendChart data={summary.monthlyTrend} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
