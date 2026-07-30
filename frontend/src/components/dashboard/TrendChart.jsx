import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, formatMonthLabel } from '../../utils/format'

export default function TrendChart({ data }) {
  const chartData = (data || []).map((point) => ({
    ...point,
    label: formatMonthLabel(point.month),
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4FA37D" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#4FA37D" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E2604F" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#E2604F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1D3841" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#9FB3B8', fontSize: 12 }} axisLine={{ stroke: '#2A4B54' }} tickLine={false} />
        <YAxis tick={{ fill: '#9FB3B8', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ background: '#152A33', border: '1px solid #2A4B54', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#EDF1F0' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#9FB3B8' }} />
        <Area type="monotone" dataKey="income" name="Income" stroke="#4FA37D" fill="url(#incomeGradient)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" name="Expense" stroke="#E2604F" fill="url(#expenseGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
