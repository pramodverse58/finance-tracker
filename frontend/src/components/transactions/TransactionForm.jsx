import { useEffect, useState } from 'react'

const EMPTY_FORM = { type: 'EXPENSE', category: '', amount: '', date: '', note: '' }

export default function TransactionForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        category: editing.category,
        amount: editing.amount,
        date: editing.date,
        note: editing.note || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editing])

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
      })
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save transaction.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-paper">{editing ? 'Edit transaction' : 'New transaction'}</h3>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1">Type</label>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={handleChange('date')}
            className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper font-mono focus:border-gold-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1">Category</label>
          <input
            type="text"
            required
            placeholder="e.g. Groceries"
            value={form.category}
            onChange={handleChange('category')}
            className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={handleChange('amount')}
            className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper font-mono focus:border-gold-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1">Note (optional)</label>
        <input
          type="text"
          value={form.note}
          onChange={handleChange('note')}
          className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold-500 text-ink-950 font-medium text-sm rounded-md px-4 py-2 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add transaction'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted hover:text-paper px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
