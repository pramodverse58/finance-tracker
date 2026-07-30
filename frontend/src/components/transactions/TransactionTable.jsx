import { formatCurrency } from '../../utils/format'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card p-8 text-center text-muted text-sm">
        No transactions yet. Add your first one on the left.
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="ledger-rule text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-normal">Date</th>
            <th className="px-4 py-3 font-normal">Category</th>
            <th className="px-4 py-3 font-normal">Note</th>
            <th className="px-4 py-3 font-normal text-right">Amount</th>
            <th className="px-4 py-3 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="ledger-rule last:border-b-0 hover:bg-ink-800/50">
              <td className="px-4 py-3 font-mono text-xs text-muted">{t.date}</td>
              <td className="px-4 py-3 text-paper">{t.category}</td>
              <td className="px-4 py-3 text-muted text-xs">{t.note}</td>
              <td className={`px-4 py-3 text-right figure ${t.type === 'INCOME' ? 'text-gain-400' : 'text-loss-400'}`}>
                {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(t.amount)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(t)}
                  className="text-xs text-muted hover:text-gold-400 mr-3 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-xs text-muted hover:text-loss-400 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
