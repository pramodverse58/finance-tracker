import { useState } from 'react'
import { downloadCsvReport, downloadPdfReport } from '../api/reportApi'
import MonthPicker from '../components/common/MonthPicker'
import { currentMonth } from '../utils/format'

export default function Reports() {
  const [month, setMonth] = useState(currentMonth())
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const handleDownload = async (type) => {
    setError('')
    setBusy(type)
    try {
      if (type === 'csv') await downloadCsvReport(month)
      else await downloadPdfReport(month)
    } catch {
      setError('Could not generate the report. Please try again.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-display text-2xl text-paper">Reports</h1>
        <p className="text-muted text-sm mt-1">Export a month of activity to keep or share</p>
      </div>

      {error && (
        <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-xs text-muted mb-1">Month</label>
          <MonthPicker month={month} onChange={setMonth} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleDownload('csv')}
            disabled={busy !== ''}
            className="flex-1 bg-ink-800 border border-ink-600 text-paper text-sm rounded-md px-4 py-3 hover:border-gold-500 transition-colors disabled:opacity-50"
          >
            {busy === 'csv' ? 'Preparing…' : '↓ Download CSV'}
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={busy !== ''}
            className="flex-1 bg-gold-500 text-ink-950 font-medium text-sm rounded-md px-4 py-3 hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {busy === 'pdf' ? 'Preparing…' : '↓ Download PDF'}
          </button>
        </div>

        <p className="text-xs text-muted">
          CSV includes every transaction row for the selected month. PDF adds a formatted summary with totals.
        </p>
      </div>
    </div>
  )
}
