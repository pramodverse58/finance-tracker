import { useEffect, useState } from 'react'
import * as transactionApi from '../api/transactionApi'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionTable from '../components/transactions/TransactionTable'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = () => {
    setLoading(true)
    transactionApi.getTransactions()
      .then(setTransactions)
      .catch(() => setError('Could not load transactions.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadTransactions() }, [])

  const handleSubmit = async (payload) => {
    if (editing) {
      const updated = await transactionApi.updateTransaction(editing.id, payload)
      setTransactions((list) => list.map((t) => (t.id === updated.id ? updated : t)))
      setEditing(null)
    } else {
      const created = await transactionApi.createTransaction(payload)
      setTransactions((list) => [created, ...list])
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    await transactionApi.deleteTransaction(id)
    setTransactions((list) => list.filter((t) => t.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-paper">Transactions</h1>
        <p className="text-muted text-sm mt-1">Every income and expense, in one ledger</p>
      </div>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-muted text-sm">Loading…</p>
          ) : (
            <TransactionTable transactions={transactions} onEdit={setEditing} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}
