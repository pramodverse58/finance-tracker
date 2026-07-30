import { useState } from 'react'
import { currentMonth } from '../../utils/format'

export default function BudgetForm({ month, onSubmit }) {
  const [category, setCategory] = useState('')
  const [limitAmount, setLimitAmount] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({ category, month, limitAmount: Number(limitAmount) })
      setCategory('')
      setLimitAmount('')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save budget.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-paper">Set a monthly limit</h3>
      <p className="text-xs text-muted -mt-2">For {month || currentMonth()}</p>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      <div>
        <label className="block text-xs text-muted mb-1">Category</label>
        <input
          type="text"
          required
          placeholder="e.g. Dining out"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1">Monthly limit</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper font-mono focus:border-gold-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-gold-500 text-ink-950 font-medium text-sm rounded-md px-4 py-2 hover:bg-gold-400 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Set budget'}
      </button>
    </form>
  )
}
